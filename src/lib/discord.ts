import type { Combination } from "./types";

/**
 * Discord Embed structure
 * @see https://discord.com/developers/docs/resources/channel#embed-object
 */
interface DiscordEmbed {
  title?: string;
  description?: string;
  color?: number;
  fields?: Array<{
    name: string;
    value: string;
    inline?: boolean;
  }>;
  timestamp?: string;
  footer?: {
    text: string;
  };
}

interface DiscordWebhookPayload {
  embeds: DiscordEmbed[];
}

/**
 * Sends a Discord embed to the configured webhook URL
 * @param embed - The Discord embed to send
 * @returns Promise that resolves when the message is sent
 */
async function sendDiscordEmbed(embed: DiscordEmbed): Promise<void> {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

  // If no webhook URL is configured, silently skip
  if (!webhookUrl) {
    return;
  }

  try {
    const payload: DiscordWebhookPayload = {
      embeds: [embed],
    };

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error(
        `Discord webhook failed: ${response.status} ${response.statusText}`
      );
    }
  } catch (error) {
    // Log error but don't throw - Discord notifications are non-critical
    console.error("Failed to send Discord notification:", error);
  }
}

/**
 * Sends a success notification to Discord with product dimensions
 * @param combination - The product combination that was generated
 */
export async function notifyDiscordSuccess(
  combination: Combination
): Promise<void> {
  const embed: DiscordEmbed = {
    title: "✅ Product Ideas Generated",
    description: "New product ideas were successfully generated!",
    color: 0x00ff00, // Green
    fields: [
      {
        name: "🏢 Market",
        value: combination.market,
        inline: true,
      },
      {
        name: "👥 User Type",
        value: combination.userType,
        inline: true,
      },
      {
        name: "🎯 Problem Type",
        value: combination.problemType,
        inline: true,
      },
      {
        name: "⚡ Tech Stack",
        value: combination.techStack,
        inline: true,
      },
      {
        name: "📅 Project Scope",
        value: combination.projectScope,
        inline: true,
      },
    ],
    timestamp: new Date().toISOString(),
    footer: {
      text: "Build Roulette",
    },
  };

  await sendDiscordEmbed(embed);
}

/**
 * Sends an error notification to Discord
 * @param error - The error that occurred
 * @param combination - The product combination that was being generated (if available)
 */
export async function notifyDiscordError(
  error: Error | unknown,
  combination?: Combination
): Promise<void> {
  const errorMessage =
    error instanceof Error ? error.message : "Unknown error occurred";

  const fields: Array<{ name: string; value: string; inline?: boolean }> = [
    {
      name: "❌ Error Message",
      value: errorMessage.substring(0, 1024), // Discord field value limit
      inline: false,
    },
  ];

  // Add combination details if available
  if (combination) {
    fields.push(
      {
        name: "🏢 Market",
        value: combination.market,
        inline: true,
      },
      {
        name: "👥 User Type",
        value: combination.userType,
        inline: true,
      },
      {
        name: "🎯 Problem Type",
        value: combination.problemType,
        inline: true,
      },
      {
        name: "⚡ Tech Stack",
        value: combination.techStack,
        inline: true,
      },
      {
        name: "📅 Project Scope",
        value: combination.projectScope,
        inline: true,
      }
    );
  }

  const embed: DiscordEmbed = {
    title: "❌ Product Generation Failed",
    description: "An error occurred while generating product ideas.",
    color: 0xff0000, // Red
    fields,
    timestamp: new Date().toISOString(),
    footer: {
      text: "Build Roulette",
    },
  };

  await sendDiscordEmbed(embed);
}

