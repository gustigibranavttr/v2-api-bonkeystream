import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { describe, expect, it } from 'vitest'

import VideoPlayer from '@/components/player/VideoPlayer.vue'
import type { Episode } from '@/models/domain'

describe('VideoPlayer resolver integration', () => {
  it('plays through the resolver while retaining the original source in server selection', async () => {
    const originalUrl = 'https://stordl.halahgan.com/streaming//MtkRYD?name=Episode_01_(1080p).mp4'
    const episode: Episode = {
      title: 'Episode 1',
      formats: [{
        label: '1080p',
        quality: 1080,
        sources: [{ label: 'Server 1', quality: 1080, url: originalUrl }],
      }],
    }

    const wrapper = mount(VideoPlayer, { props: { episode, preferredQuality: 1080 } })
    await nextTick()

    expect(wrapper.get('video').attributes('src')).toBe(
      `https://v2-api-bonkeystream.vercel.app/api/resolve?url=${encodeURIComponent(originalUrl)}`,
    )
    expect(wrapper.get('#source').element.value).toBe(originalUrl)
  })
})
