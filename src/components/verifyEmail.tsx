
import {
    Html,
    Head,
    Font,
    Preview,
    Heading,
    Row,
    Section,
    Text,
    Button,
  } from '@react-email/components';
  
  interface VerificationEmailProps {
    email:string;
    verifyCode: string;
  }
  
  export default function VerificationEmail({email,verifyCode}: VerificationEmailProps){
    return (
      <Html lang="en" dir="ltr">
        <Head>
          <title>Verification Code</title>
        </Head>
        <Preview>Here&apos;s your verification code: {verifyCode}</Preview>
        <Section>
          <Row>
            <Heading as="h2">Hello,</Heading>
          </Row>
          <Row>
            <Text>
              Thank you for registering. Please use the following verification
              code to complete your registration:
            </Text>
          </Row>
          <Row>
            <Text>{verifyCode}</Text> 
          </Row>
          <Row>
            <Text>
              If you did not request this code, please ignore this email.
            </Text>
          </Row>
        </Section>
      </Html>
    );
  }