import { Body, Container, Head, Heading, Html, Preview, Tailwind, Text, Button, Section, Hr, Img } from "@react-email/components";
import * as React from "react";

interface PointsEmailProps {
  packageId?: string;
  packageName?: string;
  reason?: string;
  pointsAdded?: number;
  walletUrl?: string;
  siteUrl?: string;
}

export const PointsEmail = ({
  packageId = "upper_room",
  packageName = "The Upper Room Package",
  reason = "Attending Both",
  pointsAdded = 50,
  walletUrl = "https://urwallet.vercel.app/wallet",
  siteUrl = "https://urwallet.vercel.app",
}: PointsEmailProps) => {
  const previewText = `You received the ${packageName}!`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-[#FCF8F2] font-sans my-auto mx-auto pt-[40px]">
          {/* Invisible space hack to prevent email clients from showing body text in preview */}
          <div style={{ display: 'none', overflow: 'hidden', lineHeight: '1px', opacity: 0, maxHeight: 0, maxWidth: 0 }}>
            {Array.from({ length: 150 }).map(() => '\u200C\u00A0').join('')}
          </div>
          <Container className="bg-white border border-[#E8DFD5] rounded-2xl mx-auto p-10 max-w-[500px] shadow-sm">
            
            <Heading className="text-[#324b4c] text-3xl font-bold text-center mt-2 p-0 tracking-tight">
              A Gift for You! ✨
            </Heading>
            
            <Text className="text-[#324b4c]/80 text-center text-lg mt-2 mb-6 tracking-wide">
              from The Upper Room family
            </Text>

            <Hr className="border-[#E8DFD5] my-6" />

            <Section className="text-center w-full mb-6 mt-4">
              <Img 
                src={`${siteUrl}/api/badge/${packageId}?t=${Date.now()}`} 
                width="140" 
                height="140" 
                alt={`${packageName} Badge`} 
                className="mx-auto" 
              />
            </Section>

            <Section className="bg-[#FCF8F2] rounded-xl p-8 text-center border border-[#E8DFD5]">
              <Text className="text-[#324b4c] text-base font-bold uppercase tracking-widest m-0">
                You Earned
              </Text>
              <Text className="text-[#d88452] text-6xl font-black tracking-tighter my-4">
                +{String(pointsAdded)}
              </Text>
              <Text className="text-[#324b4c] text-sm font-bold uppercase tracking-widest m-0 opacity-80">
                UR-Coins
              </Text>
            </Section>

            <Text className="text-[#324b4c] text-base leading-6 mt-8">
              Congratulations! You have received the <strong>{packageName}</strong> that is worth <strong>{String(pointsAdded)} UR-coins</strong> for <strong>{reason}</strong>.
            </Text>

            <Text className="text-[#324b4c] text-base leading-6 mt-4">
              Your dedication to the community does not go unnoticed. Keep attending and participating to collect more packages and level up your rank!
            </Text>

            <Section className="text-center mt-10 mb-6">
              <Button
                className="bg-[#324b4c] rounded-xl text-white text-base font-bold no-underline text-center px-10 py-4 shadow-sm"
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
          <Container className="mx-auto w-[500px] bg-[#eef2f6] rounded-b-lg p-6 text-center border-t border-[#d1d5db]">
            <Text className="text-[#007bff] text-sm font-bold m-0">The Upper Room</Text>
          </Container>

        </Body>
      </Tailwind>
    </Html>
  );
};

export default PointsEmail;
