
<script setup lang="ts">

const props = defineProps(['task']);
const emit = defineEmits(['deleteTask','updateTask']);
</script>
<template>
  <div :class="task.isCompleted? 'complete':'incomplete'">
    <v-list-item>
      <template v-slot:prepend>
        <v-list-item-action>
          <v-checkbox-btn v-model="task.isCompleted"></v-checkbox-btn>
        </v-list-item-action>
      </template>
      <v-list-item-title v-text="task.title" class="font-weight-regular text-start"></v-list-item-title>
      <template v-slot:append>
        <v-btn @click="emit('deleteTask',task.id)" size="small" variant="text" color="error" icon="mdi-delete" class="ma-2"></v-btn>
        <v-btn @click="emit('updateTask',task.id)" size="small" variant="text" color="primary" icon="mdi-pencil" class="ma-2"></v-btn>
      </template>
      <v-spacer></v-spacer>
    </v-list-item>
  </div>

</template>

<style scoped>
.incomplete{
  background-color:rgb(236, 173, 171);
  margin-bottom: .25rem;
}
.complete{
  background-color:rgb(200, 233, 200);
  margin-bottom: .25rem;
}
</style>