import {
  Body,
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

interface VerseEmailProps {
  verseText?: string;
  verseReference?: string;
}

export const VerseEmail = ({
  verseText = "إِنَّمَا لِلَّهِ انْتَظِرِي يَا نَفْسِي، لِأَنَّ مِنْ قِبَلِهِ رَجَائِي",
  verseReference = "مز 62: 5",
}: VerseEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Echoes from the Upper Room</Preview>
      <Tailwind>
        <Body className="bg-[#FCF8F2] font-sans my-auto mx-auto pt-[40px]">
          
          <Container className="bg-white border border-[#E8DFD5] rounded-2xl mx-auto p-10 max-w-[500px] shadow-sm">
            <Text className="text-[#d88452] text-4xl text-center m-0 mb-4">
              ✝
            </Text>
            <Heading className="text-[#324b4c] text-2xl font-bold text-center p-0 my-4 mx-0 tracking-tight">
              Echoes from the Upper Room
            </Heading>
            <Text className="text-[#324b4c]/80 text-base leading-6 mt-6">
              Good Morning Dear,
            </Text>
            <Text className="text-[#324b4c]/80 text-base leading-6">
              Here is your verse for today:
            </Text>
            
            <Section className="bg-[#FCF8F2] border border-[#E8DFD5] rounded-xl p-8 text-center my-6 shadow-sm">
              <Text className="text-[#324b4c] text-xl font-bold leading-8 m-0 mb-4" dir="rtl">
                "{verseText}"
              </Text>
              <Text className="text-[#324b4c] text-sm font-bold m-0 opacity-80" dir="rtl">
                - {verseReference} -
              </Text>
            </Section>

            <Text className="text-[#324b4c]/80 text-base leading-6 mt-6">
              May this verse guide your day!
            </Text>

            <Section className="text-center mt-10 mb-6">
              <Button
                className="bg-[#324b4c] rounded-xl text-white text-base font-bold no-underline text-center px-10 py-4 shadow-sm"
                href={walletUrl}
              >
                Check Your Wallet
              </Button>
            </Section>
            
            <Hr className="border border-solid border-[#E8DFD5] my-6 mx-0 w-full" />
            <Text className="text-[#324b4c]/50 text-xs leading-6 text-center">
              Please do NOT reply to this email. Please note this is an auto generated e-mail.
            </Text>
          </Container>
          
          <Container className="mx-auto w-[500px] bg-[#E8DFD5]/30 rounded-b-lg p-6 text-center border-t border-[#E8DFD5]">
            <Text className="text-[#324b4c] text-sm font-bold m-0">The Upper Room</Text>
          </Container>

        </Body>
      </Tailwind>
    </Html>
  );
};

export default VerseEmail;
