<script setup lang="ts">
import { ref, computed, Ref } from 'vue';


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

const completedTasks = computed<Task[]>(() => taskList.value.filter(t => t.isCompleted));

const clearTask = () => {
  task.value.title = '';
  task.value.id = -1;
  isUpdateItem.value = false;
}

const addTask = () => {
  if (task.value.title) {
    taskList.value.push({ id: taskList.value[taskList.value.length - 1].id + 1, title: task.value.title, isCompleted: false });
    searchText.value = '';
    task.value.title = '';
  }
  else {
    alert("task cant be empty");
  }
}

const deleteTask = (deleteTaskId: number) => {
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
  currentPage.value = 1;
  switch (filterStatus.value) {
    case 'complete':
      return list.filter(t => t.isCompleted);
    case 'incomplete':
      return list.filter(t => !t.isCompleted);
    case 'all':
      return list;
  }
}

const toggleComplete = (toggleId: number) => {
  taskList.value.find(t => t.id === toggleId).isCompleted = !taskList.value.find(t => t.id === toggleId).isCompleted;
}
const model = ref('');

</script>

<template>
  <div>
    <h1>To-Do List</h1>
    <v-text-field type="text" hide-details="auto" append-inner-icon="mdi-magnify" v-model="searchText"
      placeholder="Search Tasks ...." variant="solo" class="my-8"></v-text-field>

    <div class="my-5">
      Sort Task :
      <v-btn variant="outlined" rounded="lg" :class="sortOrder === 'asc' ? 'active' : ''"
        @click="sortOrder = 'asc'">Asc</v-btn>
      <v-btn variant="outlined" rounded="lg" :class="sortOrder === 'desc' ? 'active' : ''"
        @click="sortOrder = 'desc'">Desc</v-btn>
      <v-btn variant="outlined" rounded="lg" :class="sortOrder === 'none' ? 'active' : ''"
        @click="sortOrder = 'none'">None</v-btn>
    </div>

    <div class="d-flex justify-center align-center w-75 mx-auto">
      <h2 class="mb-6 mx-3">Filter Tasks:</h2>
      <v-select density="comfortable" class="align-self-center" :items="['all', 'complete', 'incomplete']"
        variant="solo" v-model="filterStatus">
      </v-select>
    </div>

    <div class="w-50 mx-auto">
      <h2 class="mb-3">Your Tasks</h2>
      <v-form @submit.prevent class="d-flex justify-center align-center">
        <v-text-field v-model="task.title" type="text" ref="inputRef" class="mt-5 mr-5" variant="solo"
          placeholder="Add Task..."></v-text-field>
        <v-btn type="submit" variant="outlined" rounded="lg"
          @click="isUpdateItem ? handleUpdate() : addTask()">{{ isUpdateItem ? 'Update Task' : 'Add Task' }}</v-btn>
        <v-btn variant="outlined" v-show="isUpdateItem" rounded="lg" @click="clearTask">Cancel</v-btn>
      </v-form>
    </div>

    <v-list>
      <v-list-item v-for="taskObj in paginatedList" :key="taskObj.id"
        :class="{ 'complete-task': taskObj.isCompleted, 'incomplete-task': !taskObj.isCompleted }" rounded="xl">
        <template v-slot:prepend>
          <v-list-item-action>
            <v-checkbox-btn v-model="taskObj.isCompleted"></v-checkbox-btn>
          </v-list-item-action>
        </template>

        <v-list-item-title v-text="taskObj.title" class="font-weight-regular text-start"></v-list-item-title>

        <template v-slot:append>
          <v-btn @click="deleteTask(taskObj.id)" rounded="lg" color="error" prepend-icon="mdi-delete">Delete</v-btn>
          <v-btn @click="updateTask(taskObj.id)" rounded="lg" color="primary" prepend-icon="mdi-pencil">Update</v-btn>
        </template>
        <v-spacer></v-spacer>
      </v-list-item>
    </v-list>

    <div class="text-center">
      <v-pagination v-model="currentPage" class="my-4" :length="Math.ceil(filterList.length / itemPerPage)"
        :total-visible="5"></v-pagination>
    </div>

    <p>Total:{{ taskList.length }} completed: {{ completedTasks.length }} incompleteTask:
      {{ taskList.length - completedTasks.length }}
    </p>
  </div>


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
  background-color: rgb(121, 212, 117);
}

.v-list-item {
  margin: 5px 0;
}

.incomplete-task {
  color: white;
  background-color: rgb(204, 72, 72);

}
</style>
