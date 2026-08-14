export function getNextCopyTitle(label, allTasks) {
   // match "name 1", "name 2", etc. and extract the base name and number
   const m = label.match(/^(.*?)\s+(\d+)$/);
   const baseName = m ? m[1] : label;

   // find highest number among all tasks with the same base name
   let highest = 1;
   for (const task of allTasks) {
      const match = task.label.match(/^(.*?)\s+(\d+)$/);
      if (match && match[1] === baseName) {
         highest = Math.max(highest, parseInt(match[2], 10));
      }
   }

   return `${baseName} ${highest + 1}`;
}

export function getPrevCopyIndex(label, allTasks) {
   const m = label.match(/^(.*?)\s+(\d+)$/);
   const baseName = m ? m[1] : label;

   let lastIdx = allTasks.findIndex(t => t.label === label);
   allTasks.forEach((t, idx) => {
      const match = t.label.match(/^(.*?)\s+(\d+)$/);
      const tBase = match ? match[1] : t.label;
      if (tBase === baseName) lastIdx = Math.max(lastIdx, idx);
   });

   return lastIdx;
}
