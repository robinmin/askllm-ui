<!-- Home.vue -->
<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">ASKLLM</h1>
    
    <div class="space-y-4">
      <div class="flex space-x-2 items-center">
        <Select v-model="selectedPrompt" @update:modelValue="fetchPromptData" class="flex-grow">
          <SelectTrigger>
            <SelectValue placeholder="Select a prompt" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem v-for="prompt in prompts" :key="prompt.value" :value="prompt.value">
              {{ prompt.label }}
            </SelectItem>
          </SelectContent>
        </Select>

        <div class="flex space-x-2 items-center">
          <Select v-model="selectedEngine" @update:modelValue="updateModelOptions" class="w-32">
            <SelectTrigger>
              <SelectValue placeholder="Engine" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="engine in engines" :key="engine.value" :value="engine.value">
                {{ engine.label }}
              </SelectItem>
            </SelectContent>
          </Select>

          <Select v-model="selectedModel" class="w-32">
            <SelectTrigger>
              <SelectValue placeholder="Model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="model in availableModels" :key="model.value" :value="model.value">
                {{ model.label }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button @click="runPrompt" :disabled="!canRunPrompt">
          <Play class="mr-2 h-4 w-4" />
          Run
        </Button>
      </div>

      <div v-if="promptData" class="space-y-4">
        <div v-if="promptData.parameters && promptData.parameters.length > 0">
          <h2 class="text-lg font-semibold mb-2">Prompt Parameters</h2>
          <AutoForm
            :schema="generateSchemaFromParameters(promptData.parameters)"
            v-model="parameterValues"
            @submit="handleParameterSubmit"
          />
        </div>

        <Tabs defaultValue="prompt">
          <TabsList>
            <TabsTrigger value="prompt">Prompt Content</TabsTrigger>
            <TabsTrigger value="response">Response</TabsTrigger>
          </TabsList>
          <TabsContent value="prompt">
            <Textarea v-model="promptContent" placeholder="Your Prompt Here......" rows="10" />
          </TabsContent>
          <TabsContent value="response">
            <div class="bg-muted p-4 rounded">
              {{ response }}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { AutoForm } from '@/components/ui/auto-form'
import { Play } from 'lucide-vue-next'
import { api } from '@/utils/api'
import { toast } from '@/composables/useToast'
import { /* Prompt,*/ PromptDetail, RunPromptRequest } from '@/utils/api_entity'
import * as z from 'zod'

const selectedPrompt = ref('')
const selectedEngine = ref('')
const selectedModel = ref('')
const promptContent = ref('')
const response = ref('')
const promptData = ref<PromptDetail | null>(null)
const parameterValues = ref<Record<string, any>>({})

// const prompts = ref<Prompt[]>([])
const prompts = ref([
  { value: 'prompt1', label: 'Prompt 1' },
  { value: 'prompt2', label: 'Prompt 2' },
])

const engines = ref([
  { value: 'chatgpt', label: 'ChatGPT' },
  { value: 'gpt3', label: 'GPT-3' },
])
const models = ref({
  chatgpt: [
    { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
    { value: 'gpt-4', label: 'GPT-4' },
  ],
  gpt3: [
    { value: 'text-davinci-002', label: 'Davinci' },
    { value: 'text-curie-001', label: 'Curie' },
  ],
})

const availableModels = computed(() => {
  return selectedEngine.value ? models.value[selectedEngine.value as keyof typeof models.value] : []
})

const canRunPrompt = computed(() => {
  return selectedPrompt.value && selectedEngine.value && selectedModel.value
})

const fetchPrompts = async () => {
  try {
    const fetchedPrompts = await api.getPrompts()
    prompts.value = fetchedPrompts.map(prompt => ({
      value: prompt.id,
      label: prompt.title,
    }))
  } catch (error) {
    console.error('Error fetching prompts:', error)
    toast.addToast({
      title: 'Error',
      description: 'Failed to fetch prompts. Please try again.',
      variant: 'destructive'
    })
  }
}

const fetchPromptData = async () => {
  if (!selectedPrompt.value) return

  try {
    promptData.value = await api.getPromptDetail(selectedPrompt.value)
    promptContent.value = promptData.value.content
    parameterValues.value = {} // Reset parameter values
  } catch (error) {
    console.error('Error fetching prompt data:', error)
    toast.addToast({
      title: 'Error',
      description: 'Failed to fetch prompt data. Please try again.',
      variant: 'destructive'
    })
  }
}

const updateModelOptions = () => {
  selectedModel.value = '' // Reset selected model when engine changes
}

const handleParameterSubmit = (values: Record<string, any>) => {
  parameterValues.value = values
  // You might want to update the promptContent here based on the parameter values
}

const runPrompt = async () => {
  if (!canRunPrompt.value) return

  const runPromptData: RunPromptRequest = {
    promptId: selectedPrompt.value,
    parameters: parameterValues.value,
    engine: selectedEngine.value,
    model: selectedModel.value
  }

  try {
    const result = await api.runPrompt(runPromptData)
    response.value = result.result
  } catch (error) {
    console.error('Error running prompt:', error)
    toast.addToast({
      title: 'Error',
      description: 'Failed to run the prompt. Please try again.',
      variant: 'destructive'
    })
  }
}

const generateSchemaFromParameters = (parameters: any) => z.object(parameters);

onMounted(() => {
  fetchPrompts()
})
</script>
