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

interface PointsEmailProps {
  eventName?: string;
  pointsAdded?: number;
  walletUrl?: string;
}

export const PointsEmail = ({
  eventName = "Weekly Meeting",
  pointsAdded = 10,
  walletUrl = "https://urwallet.vercel.app/wallet",
}: PointsEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>You have received +{pointsAdded} UR Points!</Preview>
      <Tailwind>
        <Body className="bg-gray-50 font-sans my-auto mx-auto px-2 pt-5 pb-12">
          
          <Container className="border border-solid border-[#007bff] rounded-lg my-10 mx-auto p-8 w-[500px] bg-white">
            <Text className="text-[#007bff] text-4xl text-center m-0 mb-4">
              ✝
            </Text>
            <Heading className="text-black text-2xl font-bold text-center p-0 my-4 mx-0">
              UR Wallet Update 🪙
            </Heading>
            
            <Text className="text-black text-base leading-6 mt-6">
              Thank you for <strong>{eventName}</strong>!
            </Text>
            
            <Section className="bg-[#e8f4fd] border border-[#b8daff] rounded p-6 text-center my-6">
              <Text className="text-[#0056b3] text-2xl font-bold m-0">
                +{pointsAdded} Points
              </Text>
              <Text className="text-[#0056b3] text-sm mt-2 mb-0">
                Have been added to your account!
              </Text>
            </Section>

            <Section className="text-center mt-8 mb-8">
              <Button
                className="bg-[#007bff] rounded text-white text-base font-bold no-underline text-center px-6 py-3"
                href={walletUrl}
              >
                Check Your Wallet Here
              </Button>
            </Section>

            <Hr className="border border-solid border-[#eaeaea] my-6 mx-0 w-full" />
            <Text className="text-[#8898aa] text-xs leading-6 text-center">
              Please do NOT reply to this email. Please note this is an auto generated e-mail.
            </Text>
          </Container>
          
          {/* Footer Area */}
          <Container className="mx-auto w-[500px] bg-[#eef2f6] rounded-b-lg p-6 text-center border-t border-[#d1d5db]">
            <Text className="text-[#007bff] text-sm font-bold m-0">The Upper Room</Text>
          </Container>

        </Body>
      </Tailwind>
    </Html>
  );
};

export default PointsEmail;
