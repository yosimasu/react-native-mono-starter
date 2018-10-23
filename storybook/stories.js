import components from '@modules/components/stories';

const storyInitializers = [
  components,
];

function loadStories() {
  const stories = [];

  storyInitializers.forEach(init => {
    init(stories);
  });

  const names = [];
  const loads = {};
  stories.forEach(store => {
    names.push(store.name);
    if (loads[store.name]) {
      loads[store.name].push(store.load);
    } else {
      loads[store.name] = [store.load];
    }
  });
  names
    .sort((first, second) => Number(first.split('/')[1]) - Number(second.split('/')[1]))
    .forEach(currentName => {
      const load = loads[currentName];
      if (load) {
        load.forEach(currentLoad => {
          currentLoad();
        });
      }
    });
}

export { loadStories };
