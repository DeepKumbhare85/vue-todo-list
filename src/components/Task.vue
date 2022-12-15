
<script setup lang="ts">

const props = defineProps(['task']);
const emit = defineEmits(['deleteTask', 'updateTask']);

</script>

<template>
  <div>
    <VListItem :active="props.task.isCompleted">

      <template #prepend>
        <VListItemAction>
          <VCheckboxBtn @click.stop="emit('updateTask',props.task.id,$event)" :model-value="props.task.isCompleted" ></VCheckboxBtn>
        </VListItemAction>
      </template>

      <VListItemTitle class="font-weight-regular text-start">{{ props.task.title }} </VListItemTitle>

      <template #append>
        <VBtn @click.stop="emit('updateTask', props.task.id,$event)" size="small" variant="plain" icon="mdi-pencil">
        </VBtn>

        <VBtn @click.stop="emit('deleteTask', props.task.id)" size="small" variant="plain" icon="mdi-delete">
        </VBtn>
      </template>

    </VListItem>


  </div>

</template>

<style lang="scss" scoped >

</style>