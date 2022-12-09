<script setup lang="ts">
import { ref, Ref, computed } from 'vue';
import Task from './Task.vue';
import { Task as TaskInterface } from '../types';

const props = defineProps(['taskList']);
const emit = defineEmits(['addTask', 'deleteTask', 'updateTask', 'updateTaskStatus']);

const task = ref<TaskInterface>({ id: -1, title: '', isCompleted: false });

const searchText = ref('');
const sortOrder: Ref<"none" | "asc" | "desc"> = ref("none");
const filterStatus: Ref<"complete" | "incomplete" | "all"> = ref('all')


const isUpdateItem = ref(false);
const inputRef = ref<HTMLInputElement | null>(null);


const itemPerPage = ref(5);
const currentPage = ref(1);
const snackbar = ref(false);



const filterList = computed<TaskInterface[]>(() => {
  const searchList = props.taskList.filter(task => {
    task.title = task.title.toLowerCase();
    return task.title.indexOf(searchText.value.toLowerCase()) > -1;
  });

  const sortedList = sortList(searchList);
  return filterTask(sortedList);

});

const paginatedList = computed<TaskInterface[]>(() => {

  let trimStart = (currentPage.value - 1) * itemPerPage.value;
  let trimEnd = trimStart + itemPerPage.value;

  let list = filterList.value.slice(trimStart, trimEnd);


  return list;
})

const sortList = (list: TaskInterface[]) => {
  switch (sortOrder.value) {
    case 'asc':
      return list.sort((a: TaskInterface, b: TaskInterface) => a.title > b.title ? 1 : a.title < b.title ? -1 : 0)

    case 'desc':
      return list.sort((a: TaskInterface, b: TaskInterface) => a.title > b.title ? -1 : a.title < b.title ? 1 : 0)

    case 'none':
      return list;
  }
}

const filterTask = (list: TaskInterface[]) => {
  switch (filterStatus.value) {
    case 'complete':
      return list.filter(t => t.isCompleted);
    case 'incomplete':
      return list.filter(t => !t.isCompleted);
    case 'all':
      return list;
  }
}

const updateTask = (updateTaskId: number) => {
  isUpdateItem.value = true;
  let taskToUpdate = props.taskList.find((t: TaskInterface) => t.id === updateTaskId)
  task.value.title = taskToUpdate.title;
  task.value.id = updateTaskId;
  inputRef.value?.focus();
}

const deleteTask = (id: number) => {
  console.log(paginatedList.value.length,currentPage.value)
  if (paginatedList.value.length === 1 && currentPage.value > 1)
  currentPage.value = currentPage.value - 1;
  
  if (task.value.id === id)
  clearTask();
  
  emit('deleteTask', id);


}

const handleUpdate = () => {
  emit('updateTask', task.value);
  clearTask();

}

const clearTask = () => {
  task.value.title = '';
  task.value.id = -1;
  isUpdateItem.value = false;
}


</script>

<template>


  <VCard class="mx-auto pa-5  ">
    <VRow align="start" class="d-flex justify-center align-center">
      <VCol cols="12" xs="12" sm="12" lg="6">
        <VTextField hide-details append-inner-icon="mdi-magnify" v-model="searchText" placeholder="Search Tasks ...."
          variant="outlined"></VTextField>
      </VCol>

      <VCol cols="12" xs="12" sm="6" lg="3">
        <VSelect hide-details label="filter task" :items="['all', 'complete', 'incomplete']"
          variant="outlined" v-model="filterStatus">
        </VSelect>
      </VCol>

      <VCol cols="12" xs="12" sm="6" lg="3">
        <VBtnToggle rounded divided variant="outlined" v-model="sortOrder"  mandatory>
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
            placeholder="Add Task ..." style="min-width:320px">
          </VTextField>

          <div class="ml-auto">
            <VBtn type="submit" class="ma-2" color="primary"
              @click="isUpdateItem ? handleUpdate() : task.title ? emit('addTask', task) : snackbar = true">
              {{ isUpdateItem ? 'Update Task' : 'Add Task' }}
            </VBtn>
            <VBtn v-show="isUpdateItem" rounded="lg" @click="clearTask">Cancel</VBtn>
          </div>
        </VForm>

      </VCol>
    </VRow>

    <VList  v-show="paginatedList.length" class="mt-5" :items='paginatedList'>
      <VListSubheader>Tasks</VListSubheader>
      <Task :task="taskObj" v-for="taskObj in paginatedList" :key="taskObj.id" @delete-task="deleteTask"
        @update-task="updateTask" @update-task-status="(id) => { emit('updateTaskStatus', id) }" />
    </VList>

    <p v-show="!paginatedList.length" class="my-5">No results found</p>
    <p class="text-right">total:{{ taskList.length }}</p>

    <div class="text-center">
      <VPagination v-show="paginatedList.length" size="small" v-model="currentPage" class="my-4"
        :length="Math.ceil(filterList.length / itemPerPage)" rounded="circle" :total-visible="4"></VPagination>
    </div>
  </VCard>

  <div class="text-center">
    <VSnackbar v-model="snackbar" :timeout="2000" color="error">
      <p>Task Can't be empty</p>
      <template v-slot:actions>
        <VBtn color="white" variant="text" @click="snackbar = false">
          Close
        </VBtn>
      </template>
    </VSnackbar>
  </div>



</template>


<style lang="scss" scoped>

</style>