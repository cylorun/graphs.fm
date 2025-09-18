import { CacheType, EmbedBuilder, Interaction } from "discord.js";
import * as trackservice from '@/shared/services/trackService'

export async  function handleTrackStatsGlobal(interaction: Interaction<CacheType>) {
    
}


export async function handleTopUserTracks(interaction: Interaction<CacheType>) {
    if (!interaction.isChatInputCommand()) return;
    const data = await trackservice.getTopUserTracks(10, 2);

    if (data.length === 0) {
        await interaction.reply("You don't have any tracked listening history yet!");
        return;
    }

    const trackList = data
        .map((t, i) => {
            const artists = t.artists.map(a => a.artistName).join(', ');
            return `${i + 1}. [**${t.trackName}**](${process.env.FRONTEND_URL}/track/${t.id}) by **${artists}** - ${t.yourPlaycount} plays`;
        })
        .join('\n');

    const embed = new EmbedBuilder()
        .setColor('#1DB954') // green
        .setTitle('Your Top Tracks')
        .setDescription(trackList)
        .setThumbnail(data[0].imageUrl)
        .setTimestamp()
        .setFooter({ text: `Requested by ${interaction.user.username}` });

    await interaction.reply({ embeds: [embed] });
}