<script setup>
import { computed, onMounted, watch } from "vue";
import { use_store } from "@/stores/store";
const store = use_store();
const stat = computed(() => store.stat);
const teams_stat = computed(() => store.teams_stat);

let cannon_interval_moving;

onMounted(async () => {
  cannon_interval_moving = setInterval(async() => {
    await store.get_stat();
  }, 5_000);

});

watch(
  () => stat.value.users_count,
  (val) => {
    if (val > 1100)
    clearInterval(cannon_interval_moving);
    cannon_interval_moving = undefined;

  },
  { deep: true }
);

</script>

<template>
  <div>
    users_count: {{ stat.users_count }}<br />
    male_share: {{ stat.male_share }}%<br />
    assigned_teams: {{ stat.assigned_teams }}<br />
    min_users_in_teams: {{ stat.min_users_in_teams }}<br />
    diff: {{ stat.diff }}<br />
  </div>

  <div
    v-for="a_row in teams_stat"
    :key="a_row.team_id">
    team_id: {{ a_row.team_id }} cnt: {{ a_row.cnt }}
  </div>
</template>
