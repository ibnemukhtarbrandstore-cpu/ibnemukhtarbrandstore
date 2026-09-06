"use client";

import { useEffect, useState } from "react";
import BaseCard from "@/app/admin/(DashboardLayout)/components/shared/BaseCard";
import PageContainer from "@/app/admin/(DashboardLayout)/components/container/PageContainer";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Switch,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  CloudUpload as CloudUploadIcon,
  AspectRatio as AspectRatioIcon,
} from "@mui/icons-material";
import Image from "next/image";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface BannerItem {
  _id: string;
  placement: "home-desktop" | "home-mobile" | "page-header" | "winter-banner" | "coupon-banner";
  image: string;
  title?: string;
  subtitle?: string;
  buttonText?: string;
  linkUrl?: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
}

const PLACEMENTS = [
  {
    key: "home-desktop",
    label: "Home Desktop Hero Swiper",
    aspectRatio: "16:9 or 2.4:1",
    recommendation: "1920 × 800 px (or 1200 × 500 px)",
    description: "Desktop homepage main slider banner",
  },
  {
    key: "home-mobile",
    label: "Home Mobile Hero Swiper",
    aspectRatio: "4:5 or 9:16",
    recommendation: "800 × 1000 px (or 720 × 1280 px)",
    description: "Mobile homepage hero slider banner",
  },
  {
    key: "page-header",
    label: "Category & Page Header",
    aspectRatio: "21:9 or 16:5",
    recommendation: "1400 × 400 px (or 1200 × 300 px)",
    description: "Top banner for category and archive pages",
  },
  {
    key: "winter-banner",
    label: "Winter & Deal Banner",
    aspectRatio: "16:9",
    recommendation: "1200 × 675 px",
    description: "Special deal highlight banner section",
  },
  {
    key: "coupon-banner",
    label: "Coupon Bar Banner",
    aspectRatio: "16:3",
    recommendation: "1200 × 220 px",
    description: "Promo coupon banner section",
  },
];

export default function BannerManagerPage() {
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlacementFilter, setSelectedPlacementFilter] = useState("all");

  // Modal State
  const [openModal, setOpenModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState<BannerItem | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    placement: "home-desktop",
    image: "",
    title: "",
    subtitle: "",
    buttonText: "",
    linkUrl: "",
    displayOrder: 0,
    isActive: true,
  });

  // Delete Confirm State
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/banners");
      const data = await res.json();
      if (data.banners) {
        setBanners(data.banners);
      }
    } catch (error) {
      toast.error("Failed to load banners");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleOpenAddModal = () => {
    setEditingBanner(null);
    setFormData({
      placement: "home-desktop",
      image: "",
      title: "",
      subtitle: "",
      buttonText: "EXPLORE NOW",
      linkUrl: "/products",
      displayOrder: banners.length + 1,
      isActive: true,
    });
    setOpenModal(true);
  };

  const handleOpenEditModal = (banner: BannerItem) => {
    setEditingBanner(banner);
    setFormData({
      placement: banner.placement,
      image: banner.image,
      title: banner.title || "",
      subtitle: banner.subtitle || "",
      buttonText: banner.buttonText || "",
      linkUrl: banner.linkUrl || "",
      displayOrder: banner.displayOrder || 0,
      isActive: banner.isActive,
    });
    setOpenModal(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);

      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dwqchugmp";
      const presetsToTry = Array.from(
        new Set([
          process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
          "ml_default",
          "usama_preset",
          "products",
        ].filter(Boolean))
      ) as string[];

      let uploadedUrl = "";
      let lastError = "";

      for (const preset of presetsToTry) {
        const uploadData = new FormData();
        uploadData.append("file", file);
        uploadData.append("upload_preset", preset);
        uploadData.append("folder", "banners");

        try {
          const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
            method: "POST",
            body: uploadData,
          });
          const data = await res.json();
          if (data.secure_url) {
            uploadedUrl = data.secure_url;
            break;
          } else if (data.error?.message) {
            lastError = data.error.message;
          }
        } catch (err: any) {
          lastError = err.message || "Network error";
        }
      }

      if (uploadedUrl) {
        setFormData((prev) => ({ ...prev, image: uploadedUrl }));
        toast.success("Image uploaded successfully!");
      } else {
        toast.error(`Upload failed: ${lastError || "Check Cloudinary preset or enter URL"}`);
      }
    } catch (err) {
      toast.error("Upload error. Please paste Image URL manually.");
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.image.trim()) {
      toast.error("Image URL is required!");
      return;
    }

    try {
      if (editingBanner) {
        // PUT update
        const res = await fetch("/api/admin/banners", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingBanner._id, ...formData }),
        });
        const data = await res.json();
        if (data.success) {
          toast.success("Banner updated successfully!");
          fetchBanners();
          setOpenModal(false);
        } else {
          toast.error(data.error || "Update failed");
        }
      } else {
        // POST create
        const res = await fetch("/api/admin/banners", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (data.success) {
          toast.success("Banner created successfully!");
          fetchBanners();
          setOpenModal(false);
        } else {
          toast.error(data.error || "Creation failed");
        }
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };

  const handleToggleActive = async (banner: BannerItem) => {
    try {
      const res = await fetch("/api/admin/banners", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: banner._id, isActive: !banner.isActive }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Banner set to ${!banner.isActive ? "Active" : "Inactive"}`);
        fetchBanners();
      }
    } catch (err) {
      toast.error("Status update failed");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/banners?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Banner deleted!");
        fetchBanners();
        setDeleteConfirmId(null);
      } else {
        toast.error(data.error || "Delete failed");
      }
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const filteredBanners = banners.filter((b) =>
    selectedPlacementFilter === "all" ? true : b.placement === selectedPlacementFilter
  );

  const selectedPlacementInfo = PLACEMENTS.find((p) => p.key === formData.placement);

  return (
    <PageContainer title="Banner Manager" description="Manage Dynamic Swipers and Banners">
      <ToastContainer position="top-right" autoClose={3000} />

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <div>
          <Typography variant="h4" fontWeight="bold">
            🖼️ Dynamic Banner Manager
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Control homepage swipers, headers, and promotional banners without editing code.
          </Typography>
        </div>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenAddModal}
          sx={{ borderRadius: 2, textTransform: "none", fontWeight: "bold" }}
        >
          Add New Banner
        </Button>
      </Box>

      {/* 📐 Aspect Ratio Guidance Card for User */}
      <Alert severity="info" icon={<AspectRatioIcon />} sx={{ mb: 4, borderRadius: 3 }}>
        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
          📸 Image Aspect Ratio & Size Guidelines for Optimal Display:
        </Typography>
        <Box display="grid" gridTemplateColumns={{ xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }} gap={2} mt={1}>
          {PLACEMENTS.map((p) => (
            <Box key={p.key} p={1.5} bgcolor="rgba(255,255,255,0.7)" borderRadius={2} border="1px dashed #bbb">
              <Typography variant="caption" fontWeight="bold" color="primary" display="block">
                {p.label}
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block">
                Ratio: <strong>{p.aspectRatio}</strong>
              </Typography>
              <Typography variant="caption" color="text.primary" display="block">
                Dimensions: <strong>{p.recommendation}</strong>
              </Typography>
            </Box>
          ))}
        </Box>
      </Alert>

      {/* Filter Tabs */}
      <Box display="flex" gap={1} mb={3} flexWrap="wrap">
        <Chip
          label={`All Banners (${banners.length})`}
          color={selectedPlacementFilter === "all" ? "primary" : "default"}
          onClick={() => setSelectedPlacementFilter("all")}
          clickable
        />
        {PLACEMENTS.map((p) => {
          const count = banners.filter((b) => b.placement === p.key).length;
          return (
            <Chip
              key={p.key}
              label={`${p.label} (${count})`}
              color={selectedPlacementFilter === p.key ? "primary" : "default"}
              onClick={() => setSelectedPlacementFilter(p.key)}
              clickable
            />
          );
        })}
      </Box>

      {/* Banner Grid List */}
      <BaseCard title="Active & Configured Banners">
        {loading ? (
          <Box p={4} textAlign="center">
            <Typography>Loading banners...</Typography>
          </Box>
        ) : filteredBanners.length === 0 ? (
          <Box p={6} textAlign="center">
            <Typography variant="h6" color="text.secondary">
              No banners found for this selection.
            </Typography>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleOpenAddModal}
              sx={{ mt: 2 }}
            >
              Add First Banner
            </Button>
          </Box>
        ) : (
          <Box display="grid" gridTemplateColumns={{ xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }} gap={3}>
            {filteredBanners.map((banner) => {
              const placementInfo = PLACEMENTS.find((p) => p.key === banner.placement);
              return (
                <Paper
                  key={banner._id}
                  elevation={2}
                  sx={{
                    borderRadius: 3,
                    overflow: "hidden",
                    border: "1px solid #e2e8f0",
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    opacity: banner.isActive ? 1 : 0.6,
                    transition: "all 0.3s ease",
                  }}
                >
                  {/* Image Preview */}
                  <Box position="relative" width="100%" height={180} bgcolor="#1e293b">
                    <Image
                      src={banner.image}
                      alt={banner.title || "Banner Image"}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <Box
                      position="absolute"
                      top={8}
                      left={8}
                      bgcolor="rgba(0,0,0,0.7)"
                      color="#fff"
                      px={1}
                      py={0.5}
                      borderRadius={1}
                    >
                      <Typography variant="caption" fontWeight="bold">
                        Order: #{banner.displayOrder}
                      </Typography>
                    </Box>
                    <Chip
                      label={banner.isActive ? "Active" : "Inactive"}
                      color={banner.isActive ? "success" : "default"}
                      size="small"
                      sx={{ position: "absolute", top: 8, right: 8, fontWeight: "bold" }}
                    />
                  </Box>

                  {/* Content */}
                  <Box p={2} flexGrow={1} display="flex" flexDirection="column" justifyContent="space-between">
                    <Box mb={2}>
                      <Chip
                        label={placementInfo?.label || banner.placement}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{ mb: 1, fontSize: 10, fontWeight: "bold" }}
                      />
                      <Typography variant="subtitle1" fontWeight="bold" noWrap>
                        {banner.title || "Untitled Banner"}
                      </Typography>
                      {banner.subtitle && (
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {banner.subtitle}
                        </Typography>
                      )}
                      {banner.linkUrl && (
                        <Typography variant="caption" color="primary" noWrap display="block" mt={0.5}>
                          🔗 {banner.linkUrl}
                        </Typography>
                      )}
                    </Box>

                    {/* Action Buttons */}
                    <Box display="flex" justifyContent="space-between" alignItems="center" pt={1} borderTop="1px solid #f1f5f9">
                      <Switch
                        checked={banner.isActive}
                        onChange={() => handleToggleActive(banner)}
                        color="primary"
                        size="small"
                      />
                      <Box display="flex" gap={0.5}>
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleOpenEditModal(banner)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => setDeleteConfirmId(banner._id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                  </Box>
                </Paper>
              );
            })}
          </Box>
        )}
      </BaseCard>

      {/* Add / Edit Dialog */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight="bold">
          {editingBanner ? "Edit Banner" : "Add New Dynamic Banner"}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent dividers>
            <Box display="flex" flexDirection="column" gap={2}>
              {/* Placement Selector */}
              <FormControl fullWidth size="small">
                <InputLabel>Banner Placement Location</InputLabel>
                <Select
                  value={formData.placement}
                  label="Banner Placement Location"
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, placement: e.target.value as any }))
                  }
                >
                  {PLACEMENTS.map((p) => (
                    <MenuItem key={p.key} value={p.key}>
                      {p.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Recommended Ratio Info Box */}
              {selectedPlacementInfo && (
                <Box p={1.5} bgcolor="#eff6ff" border="1px solid #bfdbfe" borderRadius={2}>
                  <Typography variant="caption" color="#1e40af" fontWeight="bold" display="block">
                    📐 Recommended Ratio for {selectedPlacementInfo.label}:
                  </Typography>
                  <Typography variant="body2" color="#1e3a8a">
                    • Aspect Ratio: <strong>{selectedPlacementInfo.aspectRatio}</strong> <br />
                    • Dimensions: <strong>{selectedPlacementInfo.recommendation}</strong>
                  </Typography>
                </Box>
              )}

              {/* Image Input & Upload */}
              <Box>
                <TextField
                  fullWidth
                  size="small"
                  label="Image URL"
                  value={formData.image}
                  onChange={(e) => setFormData((prev) => ({ ...prev, image: e.target.value }))}
                  placeholder="https://res.cloudinary.com/... or upload below"
                  required
                />
                <Box mt={1} display="flex" alignItems="center" gap={1}>
                  <Button
                    variant="outlined"
                    component="label"
                    size="small"
                    startIcon={<CloudUploadIcon />}
                    disabled={uploadingImage}
                  >
                    {uploadingImage ? "Uploading..." : "Upload Image to Cloudinary"}
                    <input type="file" accept="image/*" hidden onChange={handleImageUpload} />
                  </Button>
                </Box>
              </Box>

              {/* Image Live Preview */}
              {formData.image && (
                <Box position="relative" width="100%" height={150} borderRadius={2} overflow="hidden" bgcolor="#0f172a">
                  <Image
                    src={formData.image}
                    alt="Preview"
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </Box>
              )}

              <Box display="grid" gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr" }} gap={2}>
                <TextField
                  fullWidth
                  size="small"
                  label="Title / Heading (Optional)"
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g. Winter Sale 50% Off"
                />
                <TextField
                  fullWidth
                  size="small"
                  label="Subtitle (Optional)"
                  value={formData.subtitle}
                  onChange={(e) => setFormData((prev) => ({ ...prev, subtitle: e.target.value }))}
                  placeholder="e.g. Premium preloved collection"
                />
              </Box>

              <Box display="grid" gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr" }} gap={2}>
                <TextField
                  fullWidth
                  size="small"
                  label="Button Text (Optional)"
                  value={formData.buttonText}
                  onChange={(e) => setFormData((prev) => ({ ...prev, buttonText: e.target.value }))}
                  placeholder="e.g. SHOP NOW"
                />
                <TextField
                  fullWidth
                  size="small"
                  label="Target Link URL (Optional)"
                  value={formData.linkUrl}
                  onChange={(e) => setFormData((prev) => ({ ...prev, linkUrl: e.target.value }))}
                  placeholder="e.g. /products or /collections/winter"
                />
              </Box>

              <Box display="grid" gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr" }} gap={2} alignItems="center">
                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  label="Display Order (Swiper Sequence)"
                  value={formData.displayOrder}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, displayOrder: parseInt(e.target.value) || 0 }))
                  }
                  helperText="Lower numbers appear first"
                />
                <Box display="flex" alignItems="center">
                  <Typography variant="body2" mr={1}>
                    Active Status:
                  </Typography>
                  <Switch
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, isActive: e.target.checked }))
                    }
                    color="primary"
                  />
                </Box>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenModal(false)}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              {editingBanner ? "Save Changes" : "Create Banner"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={Boolean(deleteConfirmId)} onClose={() => setDeleteConfirmId(null)}>
        <DialogTitle>Delete Banner?</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this banner? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmId(null)}>Cancel</Button>
          <Button
            onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
}
