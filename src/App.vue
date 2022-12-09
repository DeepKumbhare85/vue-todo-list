<script setup lang="ts">
import { useTheme} from 'vuetify'
import TaskList from './components/TaskList.vue';
import { ref } from 'vue';
import { Task as TaskInterface } from './types'

const theme = useTheme()

 const toggleTheme = () => theme.global.name.value = theme.global.current.value.dark ? 'light' : 'customDarkTheme'

const taskList = ref<TaskInterface[]>([
  { id: 1, title: 'pineapple', isCompleted: true },
  { id: 2, title: 'grapes', isCompleted: false },
  { id: 3, title: 'almonds', isCompleted: true },
  { id: 4, title: 'papaya', isCompleted: false },
  { id: 5, title: 'waterMelon', isCompleted: true },
  { id: 6, title: 'oranges', isCompleted: false },
  { id: 7, title: 'potatoes', isCompleted: true },
  { id: 8, title: 'strawberry', isCompleted: false },
  { id: 9, title: 'banana', isCompleted: false },
  { id: 10, title: 'apple', isCompleted: false },
  { id: 11, title: 'coconut', isCompleted: true },
]);


const addTask = (task: TaskInterface) => {

  if (task.title) {
    taskList.value.push({
      id: taskList.value.length
        ? taskList.value[taskList.value.length - 1].id + 1
        : 1,
      title: task.title,
      isCompleted: false
    });
    task.title = '';
  }

}

const deleteTask = (deleteTaskId: number) => {
  taskList.value = taskList.value.filter(t => t.id !== deleteTaskId);
};

const handleUpdate = (task: TaskInterface) => {
  let taskUpdateIndex = taskList.value.findIndex(t => t.id === task.id);
  if (taskUpdateIndex >= 0)
    taskList.value[taskUpdateIndex].title = task.title;
  else
    alert('Your task is already deleted ');
}

const updateTaskStatus = (id: number) => {
  const task = taskList.value.filter(t => t.id === id)[0];
  task.isCompleted = !task.isCompleted;
}

</script>

<template>
  <VApp>
    <VMain>
      <v-btn @click="toggleTheme">theme switch</v-btn>

      <VContainer>
        <TaskList :taskList="taskList" @add-task="addTask" @delete-task="deleteTask" @update-task="handleUpdate"
          @update-task-status="updateTaskStatus" />
      </VContainer>

    </VMain>
  </VApp>



</template>


<style scoped>

</style>
