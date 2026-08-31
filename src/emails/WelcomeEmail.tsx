import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";
import * as React from "react";

interface WelcomeEmailProps {
  email?: string;
  password?: string;
  loginUrl?: string;
}

export const WelcomeEmail = ({
  email = "user@example.com",
  password = "temp-password",
  loginUrl = "https://urwallet.vercel.app/login",
}: WelcomeEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Your login credentials are inside!</Preview>
      <Tailwind>
        <Body className="bg-gray-50 font-sans my-auto mx-auto px-2 pt-5 pb-12">
          
          {/* Main Card with Blue Border similar to the screenshot */}
          <Container className="border border-solid border-[#007bff] rounded-lg my-10 mx-auto p-8 w-[500px] bg-white">
            <Text className="text-[#007bff] text-4xl text-center m-0 mb-4">
              ✝
            </Text>
            <Heading className="text-black text-2xl font-bold text-center p-0 my-4 mx-0">
              Welcome to The Upper Room Family!
            </Heading>
            <Text className="text-black text-base leading-6 mt-6">
              Dear Family Member,
            </Text>
            <Text className="text-black text-base leading-6">
              We are so happy to have you with us! Kindly see your profile credentials below so you can login, track your points, and view the verses you've collected.
            </Text>
            
            <Section className="bg-gray-100 border border-gray-200 rounded p-4 text-center my-6">
              <Text className="text-black text-lg font-bold m-0 mb-2">
                Email: {email}
              </Text>
              <Text className="text-black text-lg font-bold m-0">
                Password: {password}
              </Text>
            </Section>
            
            <Text className="text-black text-base leading-6 mt-6">
              Please click the button below to sign in:
            </Text>

            <Section className="text-center mt-[32px] mb-[32px]">
              <Button
                className="bg-[#007bff] rounded text-white text-base font-bold no-underline text-center px-6 py-3"
                href={loginUrl}
              >
                Log in to your Profile
              </Button>
            </Section>
            
            <Text className="text-black text-lg text-center leading-6 mt-8 mb-2" dir="rtl">
              <em>"لِذلِكَ اقْبَلُوا بَعْضُكُمْ بَعْضاً كَمَا أَنَّ الْمَسِيحَ أَيْضاً قَبِلَنَا، لِمَجْدِ اللهِ."</em>
            </Text>
            <Text className="text-gray-500 text-sm text-center m-0 mb-6" dir="rtl">
              (رومية 15: 7)
            </Text>

            <Hr className="border border-solid border-[#eaeaea] my-6 mx-0 w-full" />
            <Text className="text-[#8898aa] text-xs leading-6 text-center">
              Please do NOT reply to this email. Please note this is an auto generated e-mail.
            </Text>
          </Container>
          
          {/* Footer Area */}
          <Container className="mx-auto w-[500px] bg-[#324b4c] rounded-b-xl p-8 text-center mt-2 shadow-md border-t-4 border-[#d88452]">
            <Text className="text-[#FCF8F2] text-xl font-black m-0 tracking-[0.15em] uppercase">The Upper Room</Text>
            <Text className="text-[#d88452] text-[10px] font-bold uppercase tracking-[0.3em] mt-2 mb-0">Community Wallet</Text>
          </Container>

        </Body>
      </Tailwind>
    </Html>
  );
};

export default WelcomeEmail;
