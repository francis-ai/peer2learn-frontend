import { useState } from "react";
import {
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Container,
  Paper,
  Grid,
  TextField,
  Avatar,
  Chip,
  IconButton,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  Search as SearchIcon,
  Help as HelpIcon,
  QuestionAnswer as QuestionAnswerIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
} from "@mui/icons-material";

export default function Faqs() {
  const [expanded, setExpanded] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [feedback, setFeedback] = useState({});

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : null);
  };

  const handleFeedback = (id, isHelpful) => {
    setFeedback({ ...feedback, [id]: isHelpful });
  };

  const faqs = [
    // General
    {
      id: 1,
      question: "What is Peer2Learn?",
      answer:
        "Peer2Learn is an online learning platform that connects students (ages 8 and up) with peer tutors for academic support. We offer a range of subjects and allow learners to choose tutors who match their learning style, schedule, and budget.",
      category: "General",
    },
    {
      id: 2,
      question: "Who can use Peer2Learn?",
      answer:
        "Anyone aged 8 and above can use Peer2Learn. Students under 18 must have parental or guardian consent to register and participate in tutoring sessions.",
      category: "General",
    },
    {
      id: 3,
      question: "Is Peer2Learn only for school students?",
      answer:
        "No. While many of our learners are school or college students, anyone seeking academic support or peer tutoring is welcome to use the platform.",
      category: "General",
    },

    // Students & Parents
    {
      id: 4,
      question: "How do I book a tutoring session?",
      answer:
        "Simply sign up, browse available tutors by subject or skill, view their profiles and availability, then book a session that fits your schedule.",
      category: "Students & Parents",
    },
    {
      id: 5,
      question: "Do parents need to supervise sessions for younger children?",
      answer:
        "Yes. Parents or guardians are responsible for supervising students under 18, especially those under 13. This helps ensure safety and engagement during sessions.",
      category: "Students & Parents",
    },
    {
      id: 6,
      question: "Can I cancel or reschedule a session?",
      answer:
        "Yes. You can cancel or reschedule a session according to our cancellation policy. Check your dashboard for timing guidelines and eligibility for a refund.",
      category: "Students & Parents",
    },
    {
      id: 7,
      question: "Are there discounts on courses?",
      answer:
        "Yes! Discounts apply automatically to all online courses across the platform. The final price displayed includes any active promotions.",
      category: "Students & Parents",
    },

    // Tutors
    {
      id: 8,
      question: "How do I become a tutor on Peer2Learn?",
      answer:
        "Apply through our platform by creating a tutor profile, selecting your subjects, and setting your base price. Your application will be reviewed for approval.",
      category: "Tutors",
    },
    {
      id: 9,
      question: "How should I set my pricing?",
      answer:
        "Set your base price with the understanding that Peer2Learn may apply platform-wide discounts. These discounts affect the price shown to learners but not your earnings, which will reflect the base rate minus platform fees.",
      category: "Tutors",
    },
    {
      id: 10,
      question: "How and when do I get paid?",
      answer:
        "Tutor earnings are transferred via our secure payment system based on our regular payout schedule. You'll be notified when your payout is processed.",
      category: "Tutors",
    },
    {
      id: 11,
      question: "Can I tutor learners under 18?",
      answer:
        "Yes, but you must maintain a professional and age-appropriate teaching approach. Communication must be clear, respectful, and in compliance with our child safety and code of conduct policies.",
      category: "Tutors",
    },

    // Safety & Support
    {
      id: 12,
      question: "Is the platform safe for minors?",
      answer:
        "Yes. Peer2Learn is designed with age-appropriate features. However, parents or guardians are expected to supervise minors, especially learners under 13.",
      category: "Safety & Support",
    },
    {
      id: 13,
      question: "What happens if I have a problem with a tutor or session?",
      answer:
        "You can report any issue through your dashboard or contact support. We will review the situation and respond accordingly, including issuing refunds or taking disciplinary action if needed.",
      category: "Safety & Support",
    },
    {
      id: 14,
      question: "How do I contact Peer2Learn for help?",
      answer:
        "Email us at support@peer2learn.com. Our support team is here to help with any account, payment, or session-related issues.",
      category: "Safety & Support",
    },
  ];

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categories = [...new Set(faqs.map((faq) => faq.category))];

  return (
    <Container maxWidth="lg" sx={{ py: 4, mt: 12 }}>
      {/* Header */}
      <Box textAlign="center" mb={6}>
        <Avatar
          sx={{
            bgcolor: "primary.main",
            width: 64,
            height: 64,
            mx: "auto",
            mb: 2,
          }}
        >
          <HelpIcon fontSize="large" />
        </Avatar>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 600 }}>
          Peer2Learn – Frequently Asked Questions (FAQ)
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Find answers to common questions about how Peer2Learn works
        </Typography>
      </Box>

      {/* Search Bar */}
      <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search FAQs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
          }}
        />
        <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
          {categories.map((category) => (
            <Chip
              key={category}
              label={category}
              onClick={() => setSearchTerm(category)}
              variant={searchTerm === category ? "filled" : "outlined"}
              color="primary"
            />
          ))}
        </Box>
      </Paper>

      {/* FAQ List */}
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq) => (
              <Accordion
                key={faq.id}
                expanded={expanded === faq.id}
                onChange={handleChange(faq.id)}
                elevation={3}
                sx={{ mb: 2, borderRadius: "8px!important" }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{
                    backgroundColor:
                      expanded === faq.id ? "action.hover" : "background.paper",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <QuestionAnswerIcon color="primary" sx={{ mr: 2 }} />
                    <Typography variant="h6">{faq.question}</Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails
                  sx={{ borderTop: "1px solid", borderColor: "divider" }}
                >
                  <Typography paragraph>{faq.answer}</Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mr: 2 }}
                    >
                      Was this helpful?
                    </Typography>
                    <IconButton
                      color={feedback[faq.id] === true ? "primary" : "default"}
                      onClick={() => handleFeedback(faq.id, true)}
                    >
                      <ThumbUpIcon />
                    </IconButton>
                    <IconButton
                      color={feedback[faq.id] === false ? "error" : "default"}
                      onClick={() => handleFeedback(faq.id, false)}
                    >
                      <ThumbDownIcon />
                    </IconButton>
                  </Box>
                </AccordionDetails>
              </Accordion>
            ))
          ) : (
            <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
              <HelpIcon sx={{ fontSize: 60, color: "grey.400", mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                No results found
              </Typography>
              <Typography color="text.secondary">
                Try a different search term or browse the categories above
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}
