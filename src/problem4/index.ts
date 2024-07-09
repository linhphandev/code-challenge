// The complexity of a loop is O(n)
function sum_to_n_a(n: number): number {
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }

  return sum;
}

// The complexity of recursion is O(n).
// Recursive calls can lead to increased memory usage because each function call is added to the stack,
// while a loop only requires a single memory.
function sum_to_n_b(n: number): number {
  if (n <= 0) return 0;
  return n + sum_to_n_c(n - 1);
}

// The complexity of mathematical function is O(1)
function sum_to_n_c(n: number): number {
  return (n * (n + 1)) / n;
}
