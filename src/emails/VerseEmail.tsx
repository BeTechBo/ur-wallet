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
      <Preview>Today's Verse of the Day from The Upper Room</Preview>
      <Tailwind>
        <Body className="bg-gray-50 font-sans my-auto mx-auto px-2 pt-5 pb-12">
          
          <Container className="border border-solid border-[#007bff] rounded-lg my-10 mx-auto p-8 w-[500px] bg-white">
            <Text className="text-[#007bff] text-4xl text-center m-0 mb-4">
              ✝
            </Text>
            <Heading className="text-black text-2xl font-bold text-center p-0 my-4 mx-0">
              Verse of the Day 📖
            </Heading>
            <Text className="text-black text-base leading-6 mt-6">
              Good Morning Dear,
            </Text>
            <Text className="text-black text-base leading-6">
              Here is today's verse of the day:
            </Text>
            
            <Section className="bg-[#fcf8e3] border border-[#faebcc] rounded p-8 text-center my-6 shadow-sm">
              <Text className="text-[#8a6d3b] text-xl font-bold leading-8 m-0 mb-4" dir="rtl">
                "{verseText}"
              </Text>
              <Text className="text-[#8a6d3b] text-sm font-bold m-0" dir="rtl">
                - {verseReference} -
              </Text>
            </Section>

            <Text className="text-black text-base leading-6 text-center mt-6 italic">
              May Jesus bless you in this day.
            </Text>

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

export default VerseEmail;
