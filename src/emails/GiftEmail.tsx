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

interface GiftEmailProps {
  senderName?: string;
  recipientName?: string;
  coinsAmount?: number;
  personalNote?: string;
  verseText?: string;
  verseReference?: string;
  giftUrl?: string;
}

export const GiftEmail = ({
  senderName = "A Friend",
  recipientName = "Friend",
  coinsAmount = 5,
  personalNote = "",
  verseText = "",
  verseReference = "",
  giftUrl = "https://urwallet.vercel.app/gift/token",
}: GiftEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>
        {senderName} sent you a special gift from The Upper Room family
      </Preview>
      <Tailwind>
        <Body className="bg-[#FCF8F2] font-sans my-auto mx-auto pt-[40px]">
          {/* Invisible padding to suppress preview bleed */}
          <div
            style={{
              display: "none",
              overflow: "hidden",
              lineHeight: "1px",
              opacity: 0,
              maxHeight: 0,
              maxWidth: 0,
            }}
          >
            {Array.from({ length: 150 })
              .map(() => "\u200C\u00A0")
              .join("")}
          </div>

          <Container className="bg-white border border-[#E8DFD5] rounded-2xl mx-auto p-10 max-w-[500px] shadow-sm">
            {/* Cross header */}
            <Text className="text-[#324b4c] text-3xl text-center m-0 mb-2">
              ✝
            </Text>

            <Heading className="text-[#324b4c] text-2xl font-bold text-center mt-0 p-0 tracking-tight">
              You have a Gift Waiting!
            </Heading>

            <Text className="text-[#324b4c]/70 text-center text-base mt-1 mb-0">
              from The Upper Room family
            </Text>

            <Hr className="border-[#E8DFD5] my-6" />

            {/* Gift box visual */}
            <Section className="text-center mb-4">
              <Text
                style={{
                  fontSize: "80px",
                  lineHeight: "1",
                  margin: "0 auto",
                  display: "block",
                  textAlign: "center",
                }}
              >
                🎁
              </Text>
            </Section>

            {/* Sender message */}
            <Section className="bg-[#FCF8F2] rounded-xl p-6 text-center border border-[#E8DFD5] mb-6">
              <Text className="text-[#324b4c] text-sm font-bold uppercase tracking-widest m-0 mb-1 opacity-70">
                A gift from
              </Text>
              <Text className="text-[#324b4c] text-2xl font-black m-0 tracking-tight">
                {senderName}
              </Text>
              <Text className="text-[#324b4c]/60 text-sm m-0 mt-1">
                sent you a surprise from the heart
              </Text>
            </Section>

            {/* Personal note if provided */}
            {personalNote && (
              <Section className="mb-6">
                <Text className="text-[#324b4c]/50 text-xs font-bold uppercase tracking-widest mb-2 m-0">
                  A note for you
                </Text>
                <Text
                  className="text-[#324b4c] text-base leading-7 italic pl-4 m-0"
                  style={{ borderLeft: "4px solid #d88452", paddingLeft: "16px" }}
                >
                  {personalNote}
                </Text>
              </Section>
            )}

            <Hr className="border-[#E8DFD5] my-6" />

            {/* CTA Button */}
            <Section className="text-center mt-2 mb-4">
              <Button
                className="bg-[#b84c1c] rounded-2xl text-white text-xl font-black no-underline text-center px-14 py-5 tracking-wide"
                href={giftUrl}
              >
                🎁 Unwrap Your Gift
              </Button>
            </Section>

          </Container>

          {/* Footer bar */}
          <Container className="mx-auto w-[500px] bg-[#324b4c] rounded-b-xl p-8 text-center mt-0 shadow-md border-t-4 border-[#d88452]">
            <Text className="text-[#FCF8F2] text-xl font-black m-0 tracking-[0.15em] uppercase">
              The Upper Room
            </Text>
            <Text className="text-[#d88452] text-[10px] font-bold uppercase tracking-[0.3em] mt-2 mb-0">
              Community Wallet
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default GiftEmail;
