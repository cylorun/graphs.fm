import { CacheType, Interaction } from "discord.js";
import * as trackservice from '@/shared/services/trackService'

export async  function handleTrackStatsGlobal(interaction: Interaction<CacheType>) {
    
}


export async function handleTopUserTracks(interaction: Interaction<CacheType>) {
    if (!interaction.isChatInputCommand()) return;
    const data = await trackservice.getTopUserTracks(10, 2)

    const resStr = `Top user tracks:\n ${data.map((t, i) => `${i+1}. ${t.trackName} - ${t.yourPlaycount ?? 0}\n`)}`
    await interaction.reply(resStr);
} 