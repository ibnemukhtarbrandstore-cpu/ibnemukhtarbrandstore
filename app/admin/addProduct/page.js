"use client";
import Header from "@/app/admin/(DashboardLayout)/layout/header/Header";
import ProductVideo from "@/components/product/ProductVideo";
import Sidebar from "@/app/admin/(DashboardLayout)/layout/sidebar/Sidebar";
import LoadingComponent from "@/components/atom/LoadingComponent";
import TiptapEditor from "@/components/editor/TiptapEditor";
import theme from "@/utils/theme";
import {
  Box,
  Button,
  Container,
  Grid,
  Stack,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import BaseCard from "../(DashboardLayout)/components/shared/BaseCard";
import ImageUploader from "@/components/atom/ImageUploader";
import { cancelPendingRequests } from "@/services/api";

const MainWrapper = styled("div")(() => ({
  display: "flex",
  width: "100%",
  '@media (max-width: 900px)': {
    flexDirection: "column",
  },
}));

const PageWrapper = styled("div")(() => ({
  display: "flex",
  flexGrow: 1,
  paddingBottom: "25px",
  flexDirection: "column",
  backgroundColor: "transparent",
  minHeight: "100vh",
  '@media (max-width: 900px)': {
    paddingBottom: 0,
  },
}));

// Cloudinary config for products
const CLOUDINARY_UPLOAD_URL = "https://api.cloudinary.com/v1_1/do58gkhav/upload"; // TODO: Replace <your_cloud_name> with your actual cloud name
const CLOUDINARY_UPLOAD_PRESET = "ml_default"; // TODO: Replace with your unsigned upload preset

const Page = () => {
  const [form, setForm] = useState({
    title: "",
    slug: "",
    disc: "",
    size: "",
    category: "",
    color: "",
    price: "",
    availability: "",
    flashPrice: "",
    flashStart: "",
    flashEnd: "",
    discountPercent: "",
    tags: "",
    videoUrl: "",
    // New e-commerce fields
    trackingLink: "",
    weight: "",
    dimensionLength: "",
    dimensionWidth: "",
    dimensionHeight: "",
    brand: "Ibnemukhtar",
    material: "",
    careInstructions: "",
    warranty: "",
    sku: "",
    condition: "New",
    // ✅ CONVERSION BOOST FIELDS
    benefit1Emoji: "",
    benefit1Text: "",
    benefit2Emoji: "",
    benefit2Text: "",
    benefit3Emoji: "",
    benefit3Text: "",
    review1Name: "",
    review1Location: "",
    review1Text: "",
    review1Rating: "5",
    review2Name: "",
    review2Location: "",
    review2Text: "",
    review2Rating: "5",
    // AIDA Product Page Fields
    howItWorks: "",
    mainBenefitHeadline: "",
    mainBenefitText: "",
    detailedBenefit1Title: "",
    detailedBenefit1Desc: "",
    detailedBenefit2Title: "",
    detailedBenefit2Desc: "",
    detailedBenefit3Title: "",
    detailedBenefit3Desc: "",
    howToUseHeadline: "",
    howToUseText: "",
    resultsHeadline: "",
    resultsText: "",
    stat1Percentage: "94",
    stat1Text: "",
    stat2Percentage: "97",
    stat2Text: "",
    stat3Percentage: "96",
    stat3Text: "",
  });

  const [uploadedImages, setUploadedImages] = useState([]); // [{ url, publicId, status, progress, error }]
  const [btnLoading, setBtnLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false); // <-- new state for success message
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
    }
    const fetchUserRoll = async () => {
      try {
        const res = await fetch("/api/get-user", {
          method: "POST",
          body: JSON.stringify({ token }),
          headers: { "Content-Type": "application/json" },
        });
        const result = await res.json();
        if (result.error === "Token expired") {
          toast.warn("Your session expired, login again", {
            autoClose: 1000,
            closeOnClick: true,
            pauseOnHover: true,
          });
          return;
        }
        if (result.user.roll !== "admin") {
          router.push("/");
        }
        setLoading(false);
      } catch (error) {
        toast.error("Some internal error occurred", {
          autoClose: 1000,
          closeOnClick: true,
          pauseOnHover: true,
        });
        console.error("Failed to fetch user role", error);
        router.push("/");
      }
    };
    fetchUserRoll();
    return () => {
      cancelPendingRequests();
    };
  }, [router]);

  if (loading) return <LoadingComponent />;
  if (success) {
    return (
      <MainWrapper>
        <Head>
          <title>Add Products - CHAMPION-CHOICE</title>
        </Head>
        <ToastContainer position="bottom-left" autoClose={1000} />
        <PageWrapper>
          <div className="admin-sidebar">
            <Sidebar />
          </div>
          <Container
            sx={{
              paddingTop: { xs: "10px", md: "20px" },
              maxWidth: "1200px",
              minHeight: { xs: "auto", md: "calc(100vh - 240px)" },
              px: { xs: 1, sm: 2, md: 3 },
              ml: { lg: "0px" }, // align beside the sidebar on large screens
              width: { lg: "calc(100% - 270px)", xs: "100%" }, // full width minus sidebar on lg
            }}
          >
            <Box
              sx={{
                [theme.breakpoints.up("lg")]: {
                  marginLeft: "270px",
                },
                [theme.breakpoints.down("lg")]: {
                  marginLeft: 0,
                },
                width: '100%',
              }}
            >
              <Header />
              <Container
                sx={{
                  paddingTop: { xs: "10px", md: "20px" },
                  maxWidth: "1200px",
                  minHeight: { xs: "auto", md: "calc(100vh - 240px)" },
                  px: { xs: 1, sm: 2, md: 3 },
                }}
              >
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                  <BaseCard title="Success!">
                    <Typography variant="h5" color="success.main" align="center" mb={2}>
                      Product Uploaded Successfully!
                    </Typography>
                    <Button variant="contained" color="primary" onClick={() => setSuccess(false)}>
                      Add Another Product
                    </Button>
                  </BaseCard>
                </Box>
              </Container>
            </Box>
          </Container>
        </PageWrapper>
      </MainWrapper>
    );
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleEditorChange = (content) => {
    setForm({ ...form, disc: content });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("=== FORM SUBMISSION STARTED ===");
    console.log("1. Raw Form Data:", form);
    console.log("2. AIDA Fields from Form:", {
      howItWorks: form.howItWorks,
      mainBenefitHeadline: form.mainBenefitHeadline,
      mainBenefitText: form.mainBenefitText,
      detailedBenefit1Title: form.detailedBenefit1Title,
      detailedBenefit1Desc: form.detailedBenefit1Desc,
      detailedBenefit2Title: form.detailedBenefit2Title,
      detailedBenefit2Desc: form.detailedBenefit2Desc,
      detailedBenefit3Title: form.detailedBenefit3Title,
      detailedBenefit3Desc: form.detailedBenefit3Desc,
      howToUseHeadline: form.howToUseHeadline,
      howToUseText: form.howToUseText,
      resultsHeadline: form.resultsHeadline,
      resultsText: form.resultsText,
      stat1Percentage: form.stat1Percentage,
      stat1Text: form.stat1Text,
      stat2Percentage: form.stat2Percentage,
      stat2Text: form.stat2Text,
      stat3Percentage: form.stat3Percentage,
      stat3Text: form.stat3Text
    });

    if (uploadedImages.length < 1 || uploadedImages.some(img => img.status !== "success")) {
      toast.error("Please upload at least one image successfully.", { autoClose: 1000 });
      return;
    }
    setBtnLoading(true);

    // ✅ Structure conversion fields properly
    const benefits = [];
    if (form.benefit1Emoji && form.benefit1Text) {
      benefits.push({ emoji: form.benefit1Emoji, text: form.benefit1Text });
    }
    if (form.benefit2Emoji && form.benefit2Text) {
      benefits.push({ emoji: form.benefit2Emoji, text: form.benefit2Text });
    }
    if (form.benefit3Emoji && form.benefit3Text) {
      benefits.push({ emoji: form.benefit3Emoji, text: form.benefit3Text });
    }

    const reviews = [];
    if (form.review1Name && form.review1Text) {
      reviews.push({
        name: form.review1Name,
        location: form.review1Location,
        text: form.review1Text,
        rating: parseInt(form.review1Rating),
        verified: true
      });
    }
    if (form.review2Name && form.review2Text) {
      reviews.push({
        name: form.review2Name,
        location: form.review2Location,
        text: form.review2Text,
        rating: parseInt(form.review2Rating),
        verified: true
      });
    }

    // Structure AIDA Page Data
    const detailedBenefits = [];
    if (form.detailedBenefit1Title && form.detailedBenefit1Desc) {
      detailedBenefits.push({ title: form.detailedBenefit1Title, description: form.detailedBenefit1Desc });
    }
    if (form.detailedBenefit2Title && form.detailedBenefit2Desc) {
      detailedBenefits.push({ title: form.detailedBenefit2Title, description: form.detailedBenefit2Desc });
    }
    if (form.detailedBenefit3Title && form.detailedBenefit3Desc) {
      detailedBenefits.push({ title: form.detailedBenefit3Title, description: form.detailedBenefit3Desc });
    }

    const statistics = [];
    if (form.stat1Text) {
      statistics.push({ percentage: parseInt(form.stat1Percentage) || 0, text: form.stat1Text });
    }
    if (form.stat2Text) {
      statistics.push({ percentage: parseInt(form.stat2Percentage) || 0, text: form.stat2Text });
    }
    if (form.stat3Text) {
      statistics.push({ percentage: parseInt(form.stat3Percentage) || 0, text: form.stat3Text });
    }

    const cleanForm = {
      ...form,
      tags: form.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
      images: uploadedImages.map(img => img.url),
      benefits,
      reviews,
      // AIDA Page Fields
      howItWorks: form.howItWorks,
      mainBenefitHeadline: form.mainBenefitHeadline,
      mainBenefitText: form.mainBenefitText,
      detailedBenefits,
      howToUseHeadline: form.howToUseHeadline,
      howToUseText: form.howToUseText,
      resultsHeadline: form.resultsHeadline,
      resultsText: form.resultsText,
      statistics
    };

    console.log("3. Structured Benefits:", benefits);
    console.log("4. Structured Reviews:", reviews);
    console.log("5. Structured DetailedBenefits:", detailedBenefits);
    console.log("6. Structured Statistics:", statistics);
    console.log("7. CleanForm Object (WILL BE SENT TO API):", cleanForm);
    console.log("8. CleanForm AIDA Fields:", {
      howItWorks: cleanForm.howItWorks,
      mainBenefitHeadline: cleanForm.mainBenefitHeadline,
      mainBenefitText: cleanForm.mainBenefitText,
      detailedBenefits: cleanForm.detailedBenefits,
      howToUseHeadline: cleanForm.howToUseHeadline,
      howToUseText: cleanForm.howToUseText,
      resultsHeadline: cleanForm.resultsHeadline,
      resultsText: cleanForm.resultsText,
      statistics: cleanForm.statistics
    });

    try {
      const res = await fetch("/api/addProduct", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanForm),
      });
      const data = await res.json();

      console.log("9. API Response Status:", res.status);
      console.log("10. API Response Data:", data);

      if (res.status === 201) {
        toast.error(data.error || "Something went wrong!", { autoClose: 1000 });
        // Cleanup: delete all uploaded images
        const publicIds = uploadedImages.map(img => img.publicId).filter(Boolean);
        if (publicIds.length) {
          await fetch("/api/destroy-cloudinary-image", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ publicIds }),
          });
        }
      } else {
        setForm({
          title: "",
          slug: "",
          disc: "",
          size: "",
          category: "",
          color: "",
          price: "",
          availability: "",
          flashPrice: "",
          flashStart: "",
          flashEnd: "",
          discountPercent: "",
          tags: "",
          videoUrl: "",
          trackingLink: "",
          weight: "",
          dimensionLength: "",
          dimensionWidth: "",
          dimensionHeight: "",
          brand: "Ibnemukhtar",
          material: "",
          careInstructions: "",
          warranty: "",
          sku: "",
          condition: "New",
          benefit1Emoji: "",
          benefit1Text: "",
          benefit2Emoji: "",
          benefit2Text: "",
          benefit3Emoji: "",
          benefit3Text: "",
          review1Name: "",
          review1Location: "",
          review1Text: "",
          review1Rating: "5",
          review2Name: "",
          review2Location: "",
          review2Text: "",
          review2Rating: "5",
          // AIDA fields
          howItWorks: "",
          mainBenefitHeadline: "",
          mainBenefitText: "",
          detailedBenefit1Title: "",
          detailedBenefit1Desc: "",
          detailedBenefit2Title: "",
          detailedBenefit2Desc: "",
          detailedBenefit3Title: "",
          detailedBenefit3Desc: "",
          howToUseHeadline: "",
          howToUseText: "",
          resultsHeadline: "",
          resultsText: "",
          stat1Percentage: "94",
          stat1Text: "",
          stat2Percentage: "97",
          stat2Text: "",
          stat3Percentage: "96",
          stat3Text: "",
        });
        setUploadedImages([]);
        setSuccess(true); // <-- show success message
        // console.log("Product Uploaded Successfully",success);
        toast.success("Product Uploaded Successfully", { autoClose: 1000 });
      }
    } catch (error) {
      console.error("11. ERROR during submission:", error);
      alert("Error: " + error.message);
      setBtnLoading(false);
    }
  };

  return (
    <MainWrapper>
      <Head>
        <title>Add Products - CHAMPION-CHOICE</title>
        <meta
          name="description"
          content="This page is for admin to add taekwondo uniforms and martial arts gear."
        />
      </Head>
      <ToastContainer position="bottom-left" autoClose={1000} />
      <style jsx global>{`
        .footer,
        .header {
          display: none;
        }
        @media (max-width: 900px) {
          .admin-sidebar {
            display: none !important;
          }
        }
      `}</style>

      <PageWrapper>
        <div className="admin-sidebar">
          <Sidebar />
        </div>
        <Box
          sx={{
            [theme.breakpoints.up("lg")]: {
              marginLeft: "100px",
            },
            [theme.breakpoints.down("lg")]: {
              marginLeft: 0,
            },
            width: '100%',
          }}
        >
          <Header />
          <Container
            sx={{
              paddingTop: { xs: "10px", md: "20px" },
              maxWidth: "1200px",
              minHeight: { xs: "auto", md: "calc(100vh - 240px)" },
              px: { xs: 1, sm: 2, md: 3 },
              ml: { lg: "160px" }, // align beside the sidebar on large screens
              width: { lg: "calc(100% - 270px)", xs: "100%" }, // full width minus sidebar on lg
            }}
          >
            <Box>
              <Grid item xs={12} lg={12}>
                <BaseCard title="Add Product">
                  <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <Stack spacing={3}>
                      {/* Basic Fields */}
                      <TextField name="title" label="Product Title" size="small" required value={form.title} onChange={handleChange} fullWidth />
                      <TextField name="slug" label="Slug" size="small" required value={form.slug} onChange={handleChange} fullWidth />
                      <div>
                        <Typography fontWeight="bold" mb={1}>Product Description (Rich Text Editor)</Typography>
                        <TiptapEditor content={form.disc} onChange={handleEditorChange} />
                      </div>
                      <TextField name="size" label="Size" size="small" value={form.size} onChange={handleChange} fullWidth />
                      <TextField name="category" label="Category" size="small" required value={form.category} onChange={handleChange} fullWidth />
                      <TextField name="color" label="Color" size="small" value={form.color} onChange={handleChange} fullWidth />
                      <TextField name="price" label="Price" type="number" size="small" required value={form.price} onChange={handleChange} fullWidth />
                      <TextField name="availability" label="Availability" type="number" size="small" required value={form.availability} onChange={handleChange} fullWidth />

                      {/* New Fields */}
                      <TextField name="flashPrice" label="Flash Price" type="number" size="small" value={form.flashPrice} onChange={handleChange} fullWidth />
                      <TextField name="flashStart" label="Flash Start" type="datetime-local" size="small" value={form.flashStart} onChange={handleChange} InputLabelProps={{ shrink: true }} fullWidth />
                      <TextField name="flashEnd" label="Flash End" type="datetime-local" size="small" value={form.flashEnd} onChange={handleChange} InputLabelProps={{ shrink: true }} fullWidth />
                      <TextField name="discountPercent" label="Discount %" type="number" size="small" value={form.discountPercent} onChange={handleChange} fullWidth />
                      <TextField name="tags" label="Tags (comma separated)" size="small" value={form.tags} onChange={handleChange} fullWidth />

                      {/* Video URL Input with Preview */}
                      <Box>
                        <TextField
                          name="videoUrl"
                          label="YouTube Video URL (Optional)"
                          size="small"
                          value={form.videoUrl || ''}
                          onChange={handleChange}
                          fullWidth
                          placeholder="e.g., https://www.youtube.com/watch?v=..."
                          helperText="Paste a YouTube link to show a video on the product card."
                        />
                        {form.videoUrl && (
                          <Box sx={{ mt: 2, maxWidth: '300px' }}>
                            <Typography variant="subtitle2" sx={{ mb: 1 }}>Video Preview:</Typography>
                            <ProductVideo videoUrl={form.videoUrl} autoplay={false} />
                          </Box>
                        )}
                      </Box>

                      {/* E-commerce & Shipping Fields */}
                      <Typography variant="h6" sx={{ mt: 2, mb: 1, fontWeight: 'bold', color: 'primary.main' }}>
                        E-commerce & Shipping Information
                      </Typography>

                      <TextField
                        name="trackingLink"
                        label="Tracking Link (Optional)"
                        size="small"
                        value={form.trackingLink}
                        onChange={handleChange}
                        fullWidth
                        placeholder="https://tracking.com/order/123"
                        helperText="Add tracking URL for shipped orders"
                      />

                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            name="weight"
                            label="Weight (grams)"
                            type="number"
                            size="small"
                            value={form.weight}
                            onChange={handleChange}
                            fullWidth
                            placeholder="500"
                            helperText="Product weight for shipping"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            name="sku"
                            label="SKU (Stock Keeping Unit)"
                            size="small"
                            value={form.sku}
                            onChange={handleChange}
                            fullWidth
                            placeholder="JKT-001-BLK-L"
                            helperText="Unique product identifier"
                          />
                        </Grid>
                      </Grid>

                      <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>Dimensions (cm)</Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={4}>
                          <TextField
                            name="dimensionLength"
                            label="Length"
                            type="number"
                            size="small"
                            value={form.dimensionLength}
                            onChange={handleChange}
                            fullWidth
                            placeholder="30"
                          />
                        </Grid>
                        <Grid item xs={4}>
                          <TextField
                            name="dimensionWidth"
                            label="Width"
                            type="number"
                            size="small"
                            value={form.dimensionWidth}
                            onChange={handleChange}
                            fullWidth
                            placeholder="20"
                          />
                        </Grid>
                        <Grid item xs={4}>
                          <TextField
                            name="dimensionHeight"
                            label="Height"
                            type="number"
                            size="small"
                            value={form.dimensionHeight}
                            onChange={handleChange}
                            fullWidth
                            placeholder="5"
                          />
                        </Grid>
                      </Grid>

                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            name="brand"
                            label="Brand"
                            size="small"
                            value={form.brand}
                            onChange={handleChange}
                            fullWidth
                            placeholder="Ibnemukhtar"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            name="material"
                            label="Material"
                            size="small"
                            value={form.material}
                            onChange={handleChange}
                            fullWidth
                            placeholder="Leather, Denim, Cotton"
                          />
                        </Grid>
                      </Grid>

                      <TextField
                        name="careInstructions"
                        label="Care Instructions"
                        size="small"
                        value={form.careInstructions}
                        onChange={handleChange}
                        fullWidth
                        multiline
                        rows={2}
                        placeholder="Machine wash cold, tumble dry low"
                      />

                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            name="warranty"
                            label="Warranty"
                            size="small"
                            value={form.warranty}
                            onChange={handleChange}
                            fullWidth
                            placeholder="6 months warranty"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            name="condition"
                            label="Condition"
                            size="small"
                            value={form.condition}
                            onChange={handleChange}
                            fullWidth
                            select
                            SelectProps={{ native: true }}
                          >
                            <option value="New">New</option>
                            <option value="Pre-loved">Pre-loved</option>
                            <option value="Refurbished">Refurbished</option>
                          </TextField>
                        </Grid>
                      </Grid>

                      {/* Conversion Boost Section */}
                      <Typography variant="h6" sx={{ mt: 3, mb: 2, fontWeight: 'bold', color: 'secondary.main', borderTop: '2px solid', borderColor: 'secondary.main', pt: 2 }}>
                        🚀 Conversion Boost - High-Converting Elements
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Add benefits, reviews, and guarantees to increase sales by 25-40%
                      </Typography>

                      {/* Product Benefits */}
                      <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 2, mb: 1 }}>
                        Product Benefits (3 items)
                      </Typography>
                      <Grid container spacing={1} sx={{ mb: 2 }}>
                        <Grid item xs={2}>
                          <TextField
                            name="benefit1Emoji"
                            placeholder="🌸"
                            size="small"
                            value={form.benefit1Emoji}
                            onChange={handleChange}
                            fullWidth
                            inputProps={{ maxLength: 2, style: { fontSize: '1.5rem', textAlign: 'center' } }}
                          />
                        </Grid>
                        <Grid item xs={10}>
                          <TextField
                            name="benefit1Text"
                            placeholder="Feel Confident at Events"
                            size="small"
                            value={form.benefit1Text}
                            onChange={handleChange}
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={2}>
                          <TextField
                            name="benefit2Emoji"
                            placeholder="✨"
                            size="small"
                            value={form.benefit2Emoji}
                            onChange={handleChange}
                            fullWidth
                            inputProps={{ maxLength: 2, style: { fontSize: '1.5rem', textAlign: 'center' } }}
                          />
                        </Grid>
                        <Grid item xs={10}>
                          <TextField
                            name="benefit2Text"
                            placeholder="Premium Quality That Lasts"
                            size="small"
                            value={form.benefit2Text}
                            onChange={handleChange}
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={2}>
                          <TextField
                            name="benefit3Emoji"
                            placeholder="💃"
                            size="small"
                            value={form.benefit3Emoji}
                            onChange={handleChange}
                            fullWidth
                            inputProps={{ maxLength: 2, style: { fontSize: '1.5rem', textAlign: 'center' } }}
                          />
                        </Grid>
                        <Grid item xs={10}>
                          <TextField
                            name="benefit3Text"
                            placeholder="Perfect Fit Guaranteed"
                            size="small"
                            value={form.benefit3Text}
                            onChange={handleChange}
                            fullWidth
                          />
                        </Grid>
                      </Grid>

                      {/* Customer Reviews */}
                      <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 3, mb: 1 }}>
                        Customer Reviews (2-3 reviews)
                      </Typography>

                      <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 2, p: 2, mb: 2 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>Review 1</Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <TextField
                              name="review1Name"
                              label="Name"
                              placeholder="Ayesha"
                              size="small"
                              value={form.review1Name}
                              onChange={handleChange}
                              fullWidth
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <TextField
                              name="review1Location"
                              label="Location"
                              placeholder="Lahore"
                              size="small"
                              value={form.review1Location}
                              onChange={handleChange}
                              fullWidth
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              name="review1Text"
                              label="Review Text"
                              placeholder="Bahut acha quality! Office ke liye perfect."
                              size="small"
                              value={form.review1Text}
                              onChange={handleChange}
                              fullWidth
                              multiline
                              rows={2}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              name="review1Rating"
                              label="Rating"
                              size="small"
                              value={form.review1Rating}
                              onChange={handleChange}
                              fullWidth
                              select
                              SelectProps={{ native: true }}
                            >
                              <option value="5">⭐⭐⭐⭐⭐ (5 stars)</option>
                              <option value="4">⭐⭐⭐⭐ (4 stars)</option>
                            </TextField>
                          </Grid>
                        </Grid>
                      </Box>

                      <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 2, p: 2, mb: 2 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>Review 2</Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <TextField
                              name="review2Name"
                              label="Name"
                              placeholder="Fatima"
                              size="small"
                              value={form.review2Name}
                              onChange={handleChange}
                              fullWidth
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <TextField
                              name="review2Location"
                              label="Location"
                              placeholder="Karachi"
                              size="small"
                              value={form.review2Location}
                              onChange={handleChange}
                              fullWidth
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              name="review2Text"
                              label="Review Text"
                              placeholder="Fast delivery aur beautiful packaging!"
                              size="small"
                              value={form.review2Text}
                              onChange={handleChange}
                              fullWidth
                              multiline
                              rows={2}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              name="review2Rating"
                              label="Rating"
                              size="small"
                              value={form.review2Rating}
                              onChange={handleChange}
                              fullWidth
                              select
                              SelectProps={{ native: true }}
                            >
                              <option value="5">⭐⭐⭐⭐⭐ (5 stars)</option>
                              <option value="4">⭐⭐⭐⭐ (4 stars)</option>
                            </TextField>
                          </Grid>
                        </Grid>
                      </Box>

                      {/* ===== AIDA PRODUCT PAGE SECTION ===== */}
                      <Typography variant="h6" sx={{ mt: 4, mb: 2, fontWeight: 'bold', color: 'primary.main', borderTop: '3px solid', borderColor: 'primary.main', pt: 2 }}>
                        📄 AIDA Product Page Content
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Complete product description using AIDA principles (Apne design template ke mutabiq)
                      </Typography>

                      {/* How It Works */}
                      <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 2, mb: 1 }}>
                        💡 How It Works (Product kaise use karte hain)
                      </Typography>
                      <TextField
                        name="howItWorks"
                        placeholder="Example: Just twist the cap and apply gently on skin. Use twice daily for best results. Safe for all skin types."
                        value={form.howItWorks}
                        onChange={handleChange}
                        fullWidth
                        multiline
                        rows={2}
                        size="small"
                        sx={{ mb: 3 }}
                      />

                      {/* Main Benefit Section */}
                      <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 2, mb: 1 }}>
                        🎯 Main Benefit (Sabse bari benefit)
                      </Typography>
                      <Grid container spacing={2} sx={{ mb: 3 }}>
                        <Grid item xs={12}>
                          <TextField
                            name="mainBenefitHeadline"
                            label="Headline"
                            placeholder="Get Glowing Skin in 7 Days"
                            value={form.mainBenefitHeadline}
                            onChange={handleChange}
                            fullWidth
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            name="mainBenefitText"
                            label="Description (2-3 sentences)"
                            placeholder="Our advanced formula penetrates deep into skin layers. Clinical studies show visible results in just one week."
                            value={form.mainBenefitText}
                            onChange={handleChange}
                            fullWidth
                            multiline
                            rows={2}
                            size="small"
                          />
                        </Grid>
                      </Grid>

                      {/* Detailed Benefits */}
                      <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 2, mb: 1 }}>
                        💎 3 Detailed Benefits (Tafseel mein fayde)
                      </Typography>

                      <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 2, p: 2, mb: 2 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>Benefit 1</Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <TextField
                              name="detailedBenefit1Title"
                              label="Title"
                              placeholder="Long-Lasting Results"
                              value={form.detailedBenefit1Title}
                              onChange={handleChange}
                              fullWidth
                              size="small"
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              name="detailedBenefit1Desc"
                              label="Description (2 sentences)"
                              placeholder="Effects last up to 12 hours. No need for frequent reapplication throughout the day."
                              value={form.detailedBenefit1Desc}
                              onChange={handleChange}
                              fullWidth
                              multiline
                              rows={2}
                              size="small"
                            />
                          </Grid>
                        </Grid>
                      </Box>

                      <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 2, p: 2, mb: 2 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>Benefit 2</Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <TextField
                              name="detailedBenefit2Title"
                              label="Title"
                              placeholder="Safe & Natural"
                              value={form.detailedBenefit2Title}
                              onChange={handleChange}
                              fullWidth
                              size="small"
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              name="detailedBenefit2Desc"
                              label="Description (2 sentences)"
                              placeholder="Made with organic ingredients. Dermatologically tested and approved for sensitive skin."
                              value={form.detailedBenefit2Desc}
                              onChange={handleChange}
                              fullWidth
                              multiline
                              rows={2}
                              size="small"
                            />
                          </Grid>
                        </Grid>
                      </Box>

                      <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 2, p: 2, mb: 3 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>Benefit 3</Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <TextField
                              name="detailedBenefit3Title"
                              label="Title"
                              placeholder="Fast Absorption"
                              value={form.detailedBenefit3Title}
                              onChange={handleChange}
                              fullWidth
                              size="small"
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              name="detailedBenefit3Desc"
                              label="Description (2 sentences)"
                              placeholder="Lightweight formula absorbs in seconds. No greasy residue or sticky feeling."
                              value={form.detailedBenefit3Desc}
                              onChange={handleChange}
                              fullWidth
                              multiline
                              rows={2}
                              size="small"
                            />
                          </Grid>
                        </Grid>
                      </Box>

                      {/* How to Use */}
                      <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 2, mb: 1 }}>
                        📖 How to Use (Istemal karne ka tareeqa)
                      </Typography>
                      <Grid container spacing={2} sx={{ mb: 3 }}>
                        <Grid item xs={12}>
                          <TextField
                            name="howToUseHeadline"
                            label="Headline"
                            placeholder="Simple 3-Step Application"
                            value={form.howToUseHeadline}
                            onChange={handleChange}
                            fullWidth
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            name="howToUseText"
                            label="Instructions (2-3 sentences)"
                            placeholder="Cleanse face thoroughly. Apply small amount and massage gently. Use morning and evening for best results."
                            value={form.howToUseText}
                            onChange={handleChange}
                            fullWidth
                            multiline
                            rows={2}
                            size="small"
                          />
                        </Grid>
                      </Grid>

                      {/* Results Statistics */}
                      <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 2, mb: 1 }}>
                        📊 Customer Results (Statistics)
                      </Typography>
                      <Grid container spacing={2} sx={{ mb: 3 }}>
                        <Grid item xs={12}>
                          <TextField
                            name="resultsHeadline"
                            label="Headline"
                            placeholder="Proven Results from Real Customers"
                            value={form.resultsHeadline}
                            onChange={handleChange}
                            fullWidth
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            name="resultsText"
                            label="Description"
                            placeholder="Based on 500+ customer reviews and clinical trials."
                            value={form.resultsText}
                            onChange={handleChange}
                            fullWidth
                            size="small"
                          />
                        </Grid>

                        <Grid item xs={4}>
                          <TextField
                            name="stat1Percentage"
                            label="Stat 1 %"
                            type="number"
                            value={form.stat1Percentage}
                            onChange={handleChange}
                            fullWidth
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={8}>
                          <TextField
                            name="stat1Text"
                            label="Stat 1 Text"
                            placeholder="said 'Visible improvement in 7 days'"
                            value={form.stat1Text}
                            onChange={handleChange}
                            fullWidth
                            size="small"
                          />
                        </Grid>

                        <Grid item xs={4}>
                          <TextField
                            name="stat2Percentage"
                            label="Stat 2 %"
                            type="number"
                            value={form.stat2Percentage}
                            onChange={handleChange}
                            fullWidth
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={8}>
                          <TextField
                            name="stat2Text"
                            label="Stat 2 Text"
                            placeholder="said 'Would recommend to friends'"
                            value={form.stat2Text}
                            onChange={handleChange}
                            fullWidth
                            size="small"
                          />
                        </Grid>

                        <Grid item xs={4}>
                          <TextField
                            name="stat3Percentage"
                            label="Stat 3 %"
                            type="number"
                            value={form.stat3Percentage}
                            onChange={handleChange}
                            fullWidth
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={8}>
                          <TextField
                            name="stat3Text"
                            label="Stat 3 Text"
                            placeholder="said 'Better than expensive brands'"
                            value={form.stat3Text}
                            onChange={handleChange}
                            fullWidth
                            size="small"
                          />
                        </Grid>
                      </Grid>

                      {/* Images */}
                      <ImageUploader
                        maxImages={4}
                        minImages={1}
                        onChange={setUploadedImages}
                        initialImages={[]}
                        folder="products" // ya "uniforms"
                        uploadPreset="ml_default" // ya jo bhi aapka preset ho
                      />

                      <Button type="submit" color="primary" variant="contained" fullWidth sx={{ py: 1.5, fontSize: { xs: '1rem', sm: '1.1rem' } }}>Submit</Button>
                    </Stack >
                  </form >
                </BaseCard >
              </Grid >
            </Box >
          </Container >
        </Box >
      </PageWrapper >
    </MainWrapper >
  );
};

export default Page;
