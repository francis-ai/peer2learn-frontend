import { useState } from 'react';
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
  Button,
  Avatar,
  Chip, IconButton
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Search as SearchIcon,
  Help as HelpIcon,
  QuestionAnswer as QuestionAnswerIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon
} from '@mui/icons-material';


export default function Faqs() {
  const [expanded, setExpanded] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [feedback, setFeedback] = useState({});

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : null);
  };

  const handleFeedback = (id, isHelpful) => {
    setFeedback({ ...feedback, [id]: isHelpful });
  };

  const faqs = [
    {
      id: 1,
      question: "How do I enroll in a course?",
      answer: "You can enroll in courses by clicking the 'Enroll' button on any course page. You'll be guided through the payment process and gain immediate access to course materials.",
      category: "Enrollment"
    },
    {
      id: 2,
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, bank transfers, and payment through Flutterwave and Paystack. Installment plans are available for most courses.",
      category: "Payments"
    },
    {
      id: 3,
      question: "Can I download course materials?",
      answer: "Yes, most course materials are available for download. Look for the download icon next to each resource. Some streaming-only content cannot be downloaded.",
      category: "Course Content"
    },
    {
      id: 4,
      question: "How do certificate programs work?",
      answer: "Certificate programs require completion of all assigned coursework and passing the final assessment. Digital certificates are issued immediately upon completion.",
      category: "Certificates"
    },
    {
      id: 5,
      question: "What's your refund policy?",
      answer: "We offer a 14-day money-back guarantee for all courses. Requests must be made through your account dashboard.",
      category: "Payments"
    }
  ];

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categories = [...new Set(faqs.map(faq => faq.category))];

  return (
    <Container maxWidth="lg" sx={{ py: 4, mt: 12 }}>
      <Box textAlign="center" mb={6}>
        <Avatar sx={{ bgcolor: 'primary.main', width: 60, height: 60, mx: 'auto', mb: 2 }}>
          <HelpIcon fontSize="large" />
        </Avatar>
        <Typography variant="h3" gutterBottom>
          Frequently Asked Questions
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Find answers to common questions about our platform
        </Typography>
      </Box>

      <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search FAQs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />
          }}
        />
        <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {categories.map((category) => (
            <Chip
              key={category}
              label={category}
              onClick={() => setSearchTerm(category)}
              variant={searchTerm === category ? 'filled' : 'outlined'}
              color="primary"
            />
          ))}
        </Box>
      </Paper>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq) => (
              <Accordion
                key={faq.id}
                expanded={expanded === faq.id}
                onChange={handleChange(faq.id)}
                elevation={3}
                sx={{ mb: 2, borderRadius: '8px!important' }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{ backgroundColor: expanded === faq.id ? 'action.hover' : 'background.paper' }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <QuestionAnswerIcon color="primary" sx={{ mr: 2 }} />
                    <Typography variant="h6" component="div">
                      {faq.question}
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
                  <Typography paragraph>{faq.answer}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
                      Was this helpful?
                    </Typography>
                    <IconButton
                      color={feedback[faq.id] === true ? 'primary' : 'default'}
                      onClick={() => handleFeedback(faq.id, true)}
                    >
                      <ThumbUpIcon />
                    </IconButton>
                    <IconButton
                      color={feedback[faq.id] === false ? 'error' : 'default'}
                      onClick={() => handleFeedback(faq.id, false)}
                    >
                      <ThumbDownIcon />
                    </IconButton>
                  </Box>
                </AccordionDetails>
              </Accordion>
            ))
          ) : (
            <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
              <HelpIcon sx={{ fontSize: 60, color: 'grey.400', mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                No results found
              </Typography>
              <Typography color="text.secondary">
                Try a different search term or browse the categories above
              </Typography>
            </Paper>
          )}
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, position: 'sticky', top: 20, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <HelpIcon color="primary" sx={{ mr: 1 }} />
              Need more help?
            </Typography>
            <Typography paragraph>
              Can't find what you're looking for? Our support team is ready to help you.
            </Typography>
            <Button
              variant="contained"
              fullWidth
              sx={{ mt: 2 }}
              onClick={() => console.log('Contact support')}
            >
              Contact Support
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};