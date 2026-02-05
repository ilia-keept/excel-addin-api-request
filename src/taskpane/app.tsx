import { Button, Code, Container, Stack, Text, Title } from '@mantine/core'
import { useState } from 'react'
import { clearCache } from '../functions/get-or-fetch'

export function App() {
  const [isClearing, setIsClearing] = useState(false)

  async function handleClearAndRecalculate() {
    setIsClearing(true)
    try {
      clearCache()
      await Excel.run(async (context) => {
        context.application.calculate(Excel.CalculationType.full)
        await context.sync()
      })
    } finally {
      setIsClearing(false)
    }
  }

  return (
    <Container p="md">
      <Stack gap="md">
        <Title order={3}>MUSICALL</Title>
        <Text size="sm">Available functions:</Text>
        <Code block>
          {'=MUSICALL.ISRC("deezer", "ISRC_CODE")\n=MUSICALL.ALBUM("deezer", "Queen News of the World")\n=MUSICALL.TRACK("deezer", "Queen We Will Rock You")'}
        </Code>
        <Button onClick={handleClearAndRecalculate} loading={isClearing}>
          Clear Cache & Refresh
        </Button>
      </Stack>
    </Container>
  )
}
