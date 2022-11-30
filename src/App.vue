<script setup>
import { ref, watch, computed, watchEffect } from 'vue';
const taskList = ref(['pineapple', 'banana', 'mango', 'graps', 'alomonds', 'apple', 'coconut']);
const task = ref('');
const taskIndex = ref(-1);
const isUpdateItem = ref(false);
const inputRef = ref(null);
const searchText = ref('');
const filterList = ref(taskList.value);

// watch([searchText,taskList.value], () => {
//  filterList.value=[...taskList.value].filter(t => {
//    t = t.toLowerCase();
//    console.log(t)
//     return t.indexOf(searchText.value) > -1;
//  })

// })


watchEffect(() => {
  filterList.value = [...taskList.value].filter(t => {
    t = t.toLowerCase();
    console.log(t)
    return t.indexOf(searchText.value) > -1;
  })
})


const clearTask = () => {
  task.value = '';
  taskIndex.value = -1;
  isUpdateItem.value = false;
}

const addTask = () => {
  if (task.value) {
    taskList.value.push(task.value);
    task.value = '';
  }
  else {
    alert("task cant be empty");
  }
}

const deleteTask = (taskToDelete) => {
  taskList.value = taskList.value.filter(t => t !== taskToDelete)
}

const updateTask = (updateTask) => {
  console.log(updateTask)
  isUpdateItem.value = true;
  task.value = updateTask;
  taskIndex.value = taskList.value.indexOf(updateTask);
  inputRef.value.focus();
}

const handleUpdate = () => {
  if (taskList.value[taskIndex.value]) {
    taskList.value[taskIndex.value] = task.value;
    clearTask();
  }
  else {
    alert("Task already deleted");
    clearTask();
  }
}


</script>

<template>
  <div>
    <h1>To-Do List</h1>
    <form @submit.prevent>
      <input v-model="task" type="text" ref="inputRef" />
      <button
        @click="isUpdateItem ? handleUpdate() : addTask()">{{ isUpdateItem ? 'Update Task' : 'Add Task' }}</button>
      <button v-show="isUpdateItem" @click="clearTask">close</button>
    </form>
    <div class="item-list">
      {{ filterList }}
      <h2>Your Tasks</h2>
      <div>
        Sort Task :
        <button @click="taskList.sort()"> Asc </button>
        <button @click="taskList.sort().reverse()"> Desc </button>
        <button @click=""> None </button>
      </div>

      <input type="text" v-model="searchText" placeholder="Search Tasks ...." />
      <div v-for="(task, index) in filterList" :key="index">
        <div class="item">
          <h3 id="item-name">{{ task }}</h3>
          <button @click="updateTask(task)">Update</button>
          <button @click="deleteTask(task)">Delete</button>
        </div>
      </div>
      <div>Total Tasks: {{ filterList.length }}</div>
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

#item-name {
  margin-right: auto;
}
</style>
