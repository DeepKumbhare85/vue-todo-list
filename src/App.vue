<script setup>
import { ref, computed, } from 'vue';

const taskList = ref([
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
const task = ref({ id: -1, title: '', isCompleted: false });
const items = ref([{name:'Heet',age:21,id:33},{ name: 'Deep', id: 23, age: 21 }]);

const isUpdateItem = ref(false);
const inputRef = ref(null);

const searchText = ref('');
const sortOrder = ref('none');
const filterStatus = ref('all')

const itemPerPage = ref(3);
const currentPage = ref(1);


const filterList = computed(() => {
  const searchList = taskList.value.filter((t) => {
    t = t.title.toLowerCase();
    return t.indexOf(searchText.value.toLowerCase()) > -1;
  });

  const sortedList = sortList(searchList, sortOrder);
  return filterTask(sortedList, filterStatus.value);

});

const paginatedList = computed(() => {

  console.log(filterList.value);
  let trimStart = (currentPage.value - 1) * itemPerPage.value;
  let trimEnd = trimStart + itemPerPage.value;

  return filterList.value.slice(trimStart, trimEnd);
})

const completedTasks = computed(() => {
  return taskList.value.filter(t => t.isCompleted);
})

const clearTask = () => {
  task.value.title = '';
  task.value.id = -1;
  isUpdateItem.value = false;
}

const addTask = () => {
  if (task.value.title) {
    taskList.value.push({ id: taskList.value[taskList.value.length] + 1, title: task.value.title, isCompleted: false });
    searchText.value = '';
    task.value.title = '';
  }
  else {
    alert("task cant be empty");
  }
}

const deleteTask = (deleteTaskId) => {
  if (task.value.id === deleteTaskId) {
    clearTask();
  }
  taskList.value = taskList.value.filter(t => t.id !== deleteTaskId);
}

const updateTask = (updateTaskId) => {
  isUpdateItem.value = true;

  let taskToUpdate = taskList.value.find(t => t.id === updateTaskId)

  task.value.title = taskToUpdate.title;
  task.value.id = taskToUpdate.id;

  inputRef.value.focus();
}

const handleUpdate = () => {
  let taskUpdateIndex = taskList.value.findIndex(t => t.id === task.value.id);
  if (taskUpdateIndex >= 0)
    taskList.value[taskUpdateIndex].title = task.value.title;
  else
    alert('Your task is already deleted ');
  clearTask();
}


const sortList = (list, sortOrder) => {
  switch (sortOrder.value) {
    case 'asc':
      return list.sort((a, b) => (a.title > b.title) ? 1 : ((a.title < b.title) ? -1 : 0));
    case 'desc':
      return list.sort((a, b) => (b.title > a.title) ? 1 : ((b.title < a.title) ? -1 : 0));
    case 'none':
      return list;
  }
}

const filterTask = (list, filterStatus) => {
  currentPage.value = 1;
  switch (filterStatus) {
    case 'complete':
      return list.filter(t => t.isCompleted);
    case 'incomplete':
      return list.filter(t => !t.isCompleted);
    case 'all':
      return list;
  }
}

const toggleComplete = (toggleId) => {
  taskList.value.find(t => t.id === toggleId).isCompleted = !taskList.value.find(t => t.id === toggleId).isCompleted;
}


</script>

<template>
  <div>
    <h1>To-Do List</h1>
    <input type="text" id="searchbar" v-model="searchText" placeholder="Search Tasks ...." />
    <div>
      Sort Task :
      <button @click="sortOrder = 'asc'">Asc</button>
      <button @click="sortOrder = 'desc'">Desc</button>
      <button @click="sortOrder = 'none'">None</button>
    </div>

    <div id="filter-task">
      <h2>Filter Tasks:</h2>
      <select name="filter-select" id="filter-select" v-model="filterStatus">
        <option value="all" selected>All Task</option>
        <option value="complete">Completed Tasks</option>
        <option value="incomplete">Incomplete Tasks</option>
      </select>
    </div>
    <h2>Your Tasks</h2>
    <form @submit.prevent>
      <input v-model="task.title" type="text" ref="inputRef" />
      <button
        @click="isUpdateItem ? handleUpdate() : addTask()">{{ isUpdateItem ? 'Update Task' : 'Add Task' }}</button>
      <button v-show="isUpdateItem" @click="clearTask">Cancel</button>
    </form>

    <div class="item-list">
      <div v-for="taskObj in paginatedList" :key="taskObj.id">
        <div class="item" :class="{ completedTask: taskObj.isCompleted, incompleteTask: !taskObj.isCompleted }">
          <input type="checkbox" :checked="taskObj.isCompleted" @change="toggleComplete(taskObj.id)" />
          <h3 class="item-name">{{ taskObj.title }}</h3>
          <button @click="updateTask(taskObj.id)">Update</button>
          <button @click="deleteTask(taskObj.id)">Delete</button>
        </div>
      </div>
      <div v-show="!paginatedList.length">No Result Found </div>
      <div id="pagination">
        <span v-for="pageNumber in Math.ceil(filterList.length / itemPerPage)">
          <button :class="{ active: pageNumber === currentPage }" @click="currentPage = pageNumber">
            {{ pageNumber }}
          </button>
        </span>
      </div>
    </div>
    <div>Total:{{ taskList.length }} completed: {{ completedTasks.length }} incompleteTask:
      {{ taskList.length - completedTasks.length }}
    </div>
       
  </div>
</template>


<style scoped>
.item-list {
  margin: 2rem 0;
  width: 75vw;
}

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

input[type="checkbox"] {
  display: inline-block;
  width: auto;
  margin: 0;
}

.active {
  background-color: #4AAE9B;
  color: white;
}

#filter-task {
  display: flex;
  justify-content: space-around;
  align-items: center;

}

#filter-select {
  display: inline-block;
  font-size: large;
  height: 4vh;
  padding: .2rem .3rem;
  width: 60vw;
}

.completedTask {
  background-color: rgb(74, 231, 153);
}

.incompleteTask {
  background-color: rgb(233, 60, 30);
  color: rgb(239, 241, 234);
}
</style>
