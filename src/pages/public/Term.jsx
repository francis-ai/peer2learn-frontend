import {
  Box,
  Container,
  Typography,
  Paper,
  Avatar,
} from "@mui/material";
import {
  Gavel as GavelIcon,
} from "@mui/icons-material";

export default function Terms() {
  return (
    <Container maxWidth="md" sx={{ py: 4, mt: 12 }}>
      {/* Header Section */}
      <Box textAlign="center" mb={6}>
        <Avatar
          sx={{
            bgcolor: "primary.main",
            width: 64,
            height: 64,
            mx: "auto",
            mb: 3,
          }}
        >
          <GavelIcon sx={{ fontSize: 36 }} />
        </Avatar>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 600 }}>
          Peer2Learn – Terms and Conditions
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Effective Date: 14th Oct, 2025
        </Typography>
      </Box>

      {/* Main Content */}
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography paragraph>
          Welcome to <strong>Peer2Learn</strong>, an online platform that connects students with
          peer tutors for academic learning and support. By accessing or using our services,
          you agree to the following Terms and Conditions. Please read them carefully.
        </Typography>

        <Typography variant="h5" gutterBottom mt={4}>
          1. Acceptance of Terms
        </Typography>
        <Typography paragraph>
          By accessing or using Peer2Learn ("the Platform"), you confirm that you have read,
          understood, and agree to be bound by these Terms and Conditions, whether or not you
          register for an account.
        </Typography>

        <Typography variant="h5" gutterBottom mt={4}>
          2. Platform Overview
        </Typography>
        <Typography paragraph>
          Peer2Learn facilitates peer-to-peer tutoring services by connecting learners (“Students”)
          with tutors (“Tutors”) for academic support in various subjects. The platform supports
          communication, scheduling, and secure payment but does not directly employ tutors.
        </Typography>

        <Typography variant="h5" gutterBottom mt={4}>
          3. Age Requirements and Supervision
        </Typography>
        <Typography component="ul" sx={{ pl: 3 }}>
          <li>The platform is open to <strong>users aged 8 and above</strong>.</li>
          <li>Users under 18 years must have permission from a <strong>parent or legal guardian</strong>.</li>
          <li>
            Parents/guardians are responsible for supervising the use of the platform by minors and ensuring their
            safety during online interactions.
          </li>
        </Typography>

        <Typography variant="h5" gutterBottom mt={4}>
          4. Tutor Responsibilities
        </Typography>
        <Typography component="ul" sx={{ pl: 3 }}>
          <li>
            Tutors are independent service providers responsible for preparing and conducting quality educational sessions.
          </li>
          <li>
            Tutors must set base prices with the understanding that a platform-wide discount may apply to all online courses.
          </li>
          <li>
            Tutors agree to adjust their rates accordingly and accept the platform’s right to apply standard promotional discounts.
          </li>
          <li>Tutors must maintain professionalism and adhere to academic integrity standards.</li>
        </Typography>

        <Typography variant="h5" gutterBottom mt={4}>
          5. Course Pricing and Discounts
        </Typography>
        <Typography component="ul" sx={{ pl: 3 }}>
          <li>
            All course prices shown may reflect active platform-wide discounts or promotions.
          </li>
          <li>Discounts apply to all online courses and may affect the final amount displayed to learners.</li>
          <li>
            Peer2Learn reserves the right to offer seasonal or promotional discounts and will notify tutors of any major changes.
          </li>
        </Typography>

        <Typography variant="h5" gutterBottom mt={4}>
          6. Payments and Fees
        </Typography>
        <Typography component="ul" sx={{ pl: 3 }}>
          <li>Payments are processed securely through Peer2Learn's payment system.</li>
          <li>A service fee is deducted from tutor earnings per transaction.</li>
          <li>Payouts to tutors follow the platform’s standard payment schedule.</li>
          <li>Tutors are responsible for reporting earnings and handling applicable taxes.</li>
        </Typography>

        <Typography variant="h5" gutterBottom mt={4}>
          7. Cancellations and Refunds
        </Typography>
        <Typography component="ul" sx={{ pl: 3 }}>
          <li>Learners may cancel sessions according to the platform's cancellation policy to be eligible for a refund.</li>
          <li>Tutors are required to give reasonable notice if they must cancel a session.</li>
          <li>
            Refund requests due to session quality or technical issues will be evaluated on a case-by-case basis.
          </li>
        </Typography>

        <Typography variant="h5" gutterBottom mt={4}>
          8. Code of Conduct
        </Typography>
        <Typography paragraph>
          All users agree to communicate respectfully and professionally, use the platform only for lawful, educational
          purposes, and avoid inappropriate language, discrimination, or harassment of any kind. Accounts may be suspended
          or terminated for violations of these terms.
        </Typography>

        <Typography variant="h5" gutterBottom mt={4}>
          9. Parental Consent and Responsibilities
        </Typography>
        <Typography component="ul" sx={{ pl: 3 }}>
          <li>For users under 18, parental or guardian consent is required to create an account and book sessions.</li>
          <li>Parents/guardians agree to monitor their child’s activity and communication on the platform.</li>
          <li>Peer2Learn does not take responsibility for unsupervised use by minors.</li>
        </Typography>

        <Typography variant="h5" gutterBottom mt={4}>
          10. Limitation of Liability
        </Typography>
        <Typography component="ul" sx={{ pl: 3 }}>
          <li>Peer2Learn is not liable for academic outcomes or results from tutoring sessions.</li>
          <li>Peer2Learn is not responsible for content provided by independent tutors.</li>
          <li>
            Peer2Learn is not liable for any indirect, incidental, or consequential damages related to the use of the platform.
          </li>
        </Typography>

        <Typography variant="h5" gutterBottom mt={4}>
          11. Modifications to Terms
        </Typography>
        <Typography paragraph>
          Peer2Learn may update these Terms and Conditions at any time. Continued use of the platform after updates
          means you accept the new terms.
        </Typography>

        <Typography variant="h5" gutterBottom mt={4}>
          12. Contact Us
        </Typography>
        <Typography paragraph>
          For questions or support, contact us at:{" "}
          <a href="mailto:support@peer2learn.com">support@peer2learn.com</a>
        </Typography>
      </Paper>
    </Container>
  );
}
