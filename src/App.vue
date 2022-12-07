<script setup lang="ts">
import { ref, computed, Ref } from 'vue';
import TaskCompo from './components/TaskCompo.vue';

interface Task {
  id: number,
  title: string,
  isCompleted: boolean
}

const taskList = ref<Task[]>([
  { id: 1, title: 'pineapple', isCompleted: true },
  { id: 2, title: 'grapes', isCompleted: false },
  { id: 3, title: 'almonds', isCompleted: true },
  { id: 4, title: 'papaya', isCompleted: true },
  { id: 5, title: 'waterMelon', isCompleted: true },
  { id: 6, title: 'oranges', isCompleted: false },
  { id: 7, title: 'potatoes', isCompleted: true },
  { id: 8, title: 'strawberry', isCompleted: false },
  { id: 9, title: 'banana', isCompleted: false },
  { id: 10, title: 'apple', isCompleted: false },
  { id: 11, title: 'coconut', isCompleted: true },
]);
const task = ref<Task>({ id: -1, title: '', isCompleted: false });

const isUpdateItem = ref(false);
const inputRef = ref<HTMLInputElement | null>(null);

const searchText = ref('');
const sortOrder: Ref<"none" | "asc" | "desc"> = ref("none");
const filterStatus: Ref<"complete" | "incomplete" | "all"> = ref('all')

const itemPerPage = ref(3);
const currentPage = ref(1);
const snackbar = ref(false);

const filterList = computed<Task[]>(() => {
  const searchList = taskList.value.filter(task => {
    task.title = task.title.toLowerCase();
    return task.title.indexOf(searchText.value.toLowerCase()) > -1;
  });

  const sortedList = sortList(searchList);
  return filterTask(sortedList);

});

const paginatedList = computed<Task[]>(() => {

  console.log(filterList.value);
  let trimStart = (currentPage.value - 1) * itemPerPage.value;
  let trimEnd = trimStart + itemPerPage.value;

  return filterList.value.slice(trimStart, trimEnd);
})


const clearTask = () => {
  task.value.title = '';
  task.value.id = -1;
  isUpdateItem.value = false;
}

const addTask = () => {
  if (task.value.title) {
    taskList.value.push({ id: taskList.value.length ? taskList.value[taskList.value.length - 1].id + 1 : 1, title: task.value.title, isCompleted: false });
    searchText.value = '';
    task.value.title = '';
  }
  else {
    snackbar.value = true;
  }
}

const deleteTask = (deleteTaskId: number) => {
  if (paginatedList.value.length === 1 && currentPage.value >= 0)
    currentPage.value = currentPage.value - 1;

  if (task.value.id === deleteTaskId)
    clearTask();

  taskList.value = taskList.value.filter(t => t.id !== deleteTaskId);
}

const updateTask = (updateTaskId: number) => {
  isUpdateItem.value = true;
  let taskToUpdate = taskList.value.find(t => t.id === updateTaskId)
  task.value.title = taskToUpdate.title;
  task.value.id = updateTaskId;
  inputRef.value?.focus();
}

const handleUpdate = () => {
  let taskUpdateIndex = taskList.value.findIndex(t => t.id === task.value.id);
  if (taskUpdateIndex >= 0)
    taskList.value[taskUpdateIndex].title = task.value.title;
  else
    alert('Your task is already deleted ');
  clearTask();
}

const sortList = (list: Task[]) => {
  switch (sortOrder.value) {
    case 'asc':
      return list.sort((a: Task, b: Task) => {
        if (a.title > b.title)
          return 1;
        if (a.title < b.title)
          return -1;
        return 0;
      })
    case 'desc':
      return list.sort((a: Task, b: Task) => {
        if (a.title > b.title)
          return -1;
        if (a.title < b.title)
          return 1;
        return 0;
      });
    case 'none':
      return list;
  }
}

const filterTask = (list: Task[]) => {
  switch (filterStatus.value) {
    case 'complete':
      return list.filter(t => t.isCompleted);
    case 'incomplete':
      return list.filter(t => !t.isCompleted);
    case 'all':
      return list;
  }
}

</script>

<template>
  <v-app>
    <v-main>
      <div class="ma-5 pa-5">
        <h1>To-Do List</h1>
        <v-card>
          <v-container fluid>
            <v-row align="start" class="d-flex justify-center align-center">
              <v-col cols="12" xs="12" sm="12" lg="6">
                <v-text-field hide-details append-inner-icon="mdi-magnify" v-model="searchText"
                  placeholder="Search Tasks ...." variant="outlined"></v-text-field>
              </v-col>
              <v-col cols="12" xs="12" sm="6" lg="3">
                <v-select hide-details density="comfortable" label="filter task"
                  :items="['all', 'complete', 'incomplete']" variant="outlined" v-model="filterStatus">
                </v-select>
              </v-col>
              <v-col cols="12" xs="12" sm="6" lg="3">
                <p class="d-inline mr-5">Sort : </p>


                <v-btn-toggle rounded="lg" v-model="sortOrder" color="info" mandatory>
                  <v-btn class="ma-0" size="small" value="asc">asc</v-btn>
                  <v-btn class="ma-0" size="small" value="desc">desc</v-btn>
                  <v-btn class="ma-0" size="small" value="none">none</v-btn>
                </v-btn-toggle>
              </v-col>
            </v-row>
          </v-container>
        </v-card>

        <v-card class="my-10 pa-5">
          <h2 class="mb-3">Your Tasks</h2>
          <v-row>
            <v-col cols="12" xs="12" md="6"></v-col>
            <v-col cols="12" xs="12" md="6">
              <v-form @submit.prevent class="d-flex align-center flex-wrap">
                <v-text-field hide-details v-model="task.title" type="text" ref="inputRef" variant="outlined"
                  class="my-input" placeholder="Add Task ..." style="min-width:250px">
                </v-text-field>
                <div class="ml-auto">
                  <v-btn type="submit" rounded="lg"
                    @click="isUpdateItem ? handleUpdate() : addTask()">{{ isUpdateItem ? 'Update Task' : 'Add Task' }}
                  </v-btn>
                  <v-btn v-show="isUpdateItem" rounded="lg" @click="clearTask">Cancel</v-btn>
                </div>
              </v-form>
            </v-col>
          </v-row>

          <v-list v-show="paginatedList.length">
            <v-list-subheader>Tasks</v-list-subheader>
            <v-list-item v-for="taskObj in paginatedList" :key="taskObj.id"
              :class="{ 'complete-task': taskObj.isCompleted, 'incomplete-task': !taskObj.isCompleted }">
              <template v-slot:prepend>
                <v-list-item-action>
                  <v-checkbox-btn v-model="taskObj.isCompleted"></v-checkbox-btn>
                </v-list-item-action>
              </template>

              <v-list-item-title v-text="taskObj.title" class="font-weight-regular text-start"></v-list-item-title>

              <template v-slot:append>
                <v-btn @click="deleteTask(taskObj.id)" size="small" variant="text" color="error" icon="mdi-delete"
                  class="ma-2"></v-btn>
                <v-btn @click="updateTask(taskObj.id)" size="small" variant="text" color="primary" icon="mdi-pencil"
                  class="ma-2"></v-btn>
              </template>
              <v-spacer></v-spacer>
            </v-list-item>
          </v-list>
          <p v-show="!paginatedList.length" class="my-5">No results found</p>
          <p class="text-right">total:{{ taskList.length }}</p>

          <div class="text-center">
            <v-pagination v-show="paginatedList.length" size="small" v-model="currentPage" class="my-4"
              :length="Math.ceil(filterList.length / itemPerPage)" rounded="circle" :total-visible="3"></v-pagination>
          </div>
        </v-card>
      </div>

      <div class="text-center">
        <v-snackbar v-model="snackbar" :timeout="2000" color="error">
          <p>Task Can't be empty</p>
          <template v-slot:actions>
            <v-btn color="white" variant="text" @click="snackbar = false">
              Close
            </v-btn>
          </template>
        </v-snackbar>
      </div>


      <v-list v-show="paginatedList.length">
        <TaskCompo :task="taskObj" v-for="taskObj in paginatedList" @delete-task="deleteTask" @update-task="updateTask"/>
      </v-list>
      <p v-show="!paginatedList.length" class="my-5">No results found</p>
      <p class="text-right">total:{{ taskList.length }}</p>

      <div class="text-center">
        <v-pagination v-show="paginatedList.length" size="small" v-model="currentPage" class="my-4"
          :length="Math.ceil(filterList.length / itemPerPage)" rounded="circle" :total-visible="4"></v-pagination>
      </div>
      
    </v-main>
  </v-app>

</template>


<style scoped>
.item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin: 1.5rem 0;
  border: 2px solid black;
  padding: .4rem 2rem;
  border-radius: 1.5rem;
}

button {
  margin: .5rem;
}

.item-name {
  margin-right: auto;
  text-align: start;
}

#searchbar {
  width: 65vw;
  margin-bottom: .8rem;
  font-size: x-large;
  line-height: 2.5rem;
  border: 1px solid black;
  border-radius: 12px;
  padding: 5px;
}


.active {
  background-color: #355cdb;
  color: white;
  border: 2px solid black;
}


.complete-task {
  background-color: rgb(147, 238, 143);
}

.v-list-item {
  margin: 5px 0;
}

.incomplete-task {
  color: rgb(255, 255, 255);
  background-color: rgb(233, 154, 154);
}
</style>
