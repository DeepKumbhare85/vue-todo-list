
<script setup lang="ts">

const props = defineProps(['task']);
const emit = defineEmits(['deleteTask', 'updateTask', 'updateTaskStatus']);
</script>
<template>
  <div>
    <v-list-item @click="emit('updateTaskStatus', props.task.id)" :active="props.task.isCompleted" >
      <template v-slot:prepend>
        <v-list-item-action>
          <v-checkbox-btn v-model="props.task.isCompleted"></v-checkbox-btn>
        </v-list-item-action>
      </template>
      <v-list-item-title v-text="props.task.title" class="font-weight-regular text-start"></v-list-item-title>
      <template v-slot:append>
        <v-btn  @click.stop="emit('updateTask', props.task.id)" size="small" variant="flat" icon="mdi-pencil" class="mx-2"></v-btn>
        <v-btn  @click.stop="emit('deleteTask', props.task.id)" size="small" variant="flat" icon="mdi-delete" class="mx-2"></v-btn>
      </template>
    </v-list-item>
    <v-divider></v-divider>
  </div>
</template>

<style scoped>

</style>