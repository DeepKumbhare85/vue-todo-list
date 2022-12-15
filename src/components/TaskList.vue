<script setup lang="ts">
import { ref, Ref, computed,watch } from 'vue';
import Task from './Task.vue';
import { Task as TaskInterface } from '../types';


const props = defineProps(['taskList','listlength']);
const emit = defineEmits(['addTask', 'deleteTask', 'updateTask','toggleStatus','searchList','sortList','filterList','currentPageNumber']);

const task = ref<TaskInterface>({ id: -1, title: '', isCompleted: false });

const searchValue = ref('');
const sortOrder: Ref<"none" | "asc" | "desc"> = ref("none");
const filterStatus: Ref<"complete" | "incomplete" | "all"> = ref('all')

const isUpdateItem = ref(false);
const inputRef = ref<HTMLInputElement | null>(null);

const currentPage = ref(1);
const isEmptyTaskSnackbarVisible = ref(false);

watch(filterStatus, () => {
  currentPage.value = 1;
  emit('filterList',filterStatus.value)
})

watch(currentPage, () => {
  emit('currentPageNumber',currentPage.value)
})

const updateTask = (updateTaskId: TaskInterface['id'], event) => {
  if (event.currentTarget.type === 'checkbox')
    emit('toggleStatus',updateTaskId)
  
  else { 
    isUpdateItem.value = true;
    let taskToUpdate = props.taskList.find((t: TaskInterface) => t.id === updateTaskId)
    console.log(taskToUpdate)
    task.value.id = updateTaskId;
    task.value.title = taskToUpdate.title;
    task.value.isCompleted = taskToUpdate.isCompleted;
    console.log(task.value)
    inputRef.value?.focus();
  }

}

const deleteTask = (id: TaskInterface['id']) => {

  // if (props.taskList.value.length === 1 && currentPage.value > 1)
  //   currentPage.value = currentPage.value - 1;

  if (task.value.id === id)
    clearTask();

  emit('deleteTask', id);
}

const handleUpdate =  () => {
  emit('updateTask', task.value);
  isUpdateItem.value = false;
 
}

const clearTask = () => {
  task.value.title = '';
  task.value.id = -1;
  isUpdateItem.value = false;
}

</script>

<template>

  <VCard class="mx-auto pa-5">
    <VRow align="start" class="d-flex justify-center align-center">
      <VCol cols="12" xs="12" sm="12" lg="6">

        <VTextField hide-details append-inner-icon="mdi-magnify" v-model="searchValue" @input="emit('searchList',searchValue)"  placeholder="Search Tasks ...."
          density="comfortable" variant="outlined">
        </VTextField>
      </VCol>

      <VCol cols="12" xs="12" sm="6" lg="3">
        <VSelect hide-details label="filter task" :items="['all', 'complete', 'incomplete']" density="comfortable" 
          variant="outlined" v-model="filterStatus" >
        </VSelect>
      </VCol>

      <VCol cols="12" xs="12" sm="6" lg="3" class="text-right text-lg-center">
        <VBtnToggle @click="emit('sortList',sortOrder)" rounded divided variant="outlined" v-model="sortOrder" mandatory>
          <VBtn value="asc">asc</VBtn>
          <VBtn value="desc">desc</VBtn>
          <VBtn value="none">none</VBtn>
        </VBtnToggle>
      </VCol>

    </VRow>
  </VCard>

  <VCard class="my-10 pa-5">
    <VRow>
      <VCol offset-md="6" cols="12" xs="12" md="6">

        <VForm @submit.prevent class="d-flex align-center flex-gap-2 flex-wrap">

          <VTextField hide-details v-model="task.title" type="text" ref="inputRef" variant="outlined"
            density="comfortable" placeholder="Add Task ..." style="min-width:320px">
          </VTextField>

          <div class="ml-auto">
            <VBtn type="submit" class="ma-2" color="primary"
              @click="isUpdateItem ? handleUpdate() : task.title.trim() ? emit('addTask', task) : isEmptyTaskSnackbarVisible = true">
              {{ isUpdateItem ? 'Update Task' : 'Add Task' }}
            </VBtn>
            <VBtn v-show="isUpdateItem" @click="clearTask">Cancel</VBtn>
          </div>
        </VForm>

      </VCol>
    </VRow>
  
    <VList v-show="props.taskList.length" class="mt-5" >
      <VListSubheader>Tasks</VListSubheader>
      <template v-for="(taskObj, index) in props.taskList" :key="taskObj.id">
        <Task :task="taskObj" @delete-task="deleteTask" @update-task="updateTask" />
        <VDivider v-show="props.taskList.length !== (index +1)"></VDivider>
      </template>
    </VList>

    <p v-show="!props.taskList.length" class="my-5">No results found</p>
    <p class="text-right text-disabled">total: {{ props.listlength }}</p>

    <div class="text-center">
     
      <VPagination v-show="props.taskList.length" size="small" class="my-4" v-model="currentPage" rounded="circle" :total-visible="5" :length="Math.ceil(props.listlength / 5)" >
      </VPagination>
    </div>
  </VCard>

  <div class="text-center">
    <VSnackbar v-model="isEmptyTaskSnackbarVisible" :timeout="2000" color="error">
      <p>Task Can't be empty</p>
      <template #actions>
        <VBtn color="white" variant="text" @click="isEmptyTaskSnackbarVisible = false">
          Close
        </VBtn>
      </template>
    </VSnackbar>
  </div>

</template>

<style lang="scss" scoped>

</style>