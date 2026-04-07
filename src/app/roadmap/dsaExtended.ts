// Shared extended data for DSA patterns — used by both card view and graph view

export interface LCProblem {
  id: number;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  slug: string;
}

export interface DSAExtra {
  description: string; // witty one-liner
  problems: LCProblem[];
  deps: string[]; // pattern IDs this depends on (incoming graph edges)
}

export const dsaExtra: Record<string, DSAExtra> = {
  // ── Tier 1 ────────────────────────────────────────────────────────────────
  d01: {
    description: "Two indices walk into a sorted array… and meet in the middle.",
    deps: [],
    problems: [
      { id: 167, title: "Two Sum II", difficulty: "Medium", slug: "two-sum-ii-input-array-is-sorted" },
      { id: 15,  title: "3Sum", difficulty: "Medium", slug: "3sum" },
      { id: 11,  title: "Container With Most Water", difficulty: "Medium", slug: "container-with-most-water" },
    ],
  },
  d02: {
    description: "Like a train window — see the landscape without leaving your seat.",
    deps: [],
    problems: [
      { id: 3,   title: "Longest Substring Without Repeating", difficulty: "Medium", slug: "longest-substring-without-repeating-characters" },
      { id: 76,  title: "Minimum Window Substring", difficulty: "Hard", slug: "minimum-window-substring" },
      { id: 438, title: "Find All Anagrams in a String", difficulty: "Medium", slug: "find-all-anagrams-in-a-string" },
    ],
  },
  d03: {
    description: "The tortoise will always catch the hare… in a cycle.",
    deps: [],
    problems: [
      { id: 141, title: "Linked List Cycle", difficulty: "Easy", slug: "linked-list-cycle" },
      { id: 142, title: "Linked List Cycle II", difficulty: "Medium", slug: "linked-list-cycle-ii" },
      { id: 876, title: "Middle of the Linked List", difficulty: "Easy", slug: "middle-of-the-linked-list" },
    ],
  },
  d04: {
    description: "Half the work, twice the speed. Math did this.",
    deps: [],
    problems: [
      { id: 704, title: "Binary Search", difficulty: "Easy", slug: "binary-search" },
      { id: 35,  title: "Search Insert Position", difficulty: "Easy", slug: "search-insert-position" },
      { id: 153, title: "Find Min in Rotated Sorted Array", difficulty: "Medium", slug: "find-minimum-in-rotated-sorted-array" },
    ],
  },
  d05: {
    description: "O(1) lookup — the holy grail. Trade RAM for sanity.",
    deps: [],
    problems: [
      { id: 1,   title: "Two Sum", difficulty: "Easy", slug: "two-sum" },
      { id: 49,  title: "Group Anagrams", difficulty: "Medium", slug: "group-anagrams" },
      { id: 128, title: "Longest Consecutive Sequence", difficulty: "Medium", slug: "longest-consecutive-sequence" },
    ],
  },
  d06: {
    description: "Last in, first out. Just like your unread browser tabs.",
    deps: [],
    problems: [
      { id: 20,  title: "Valid Parentheses", difficulty: "Easy", slug: "valid-parentheses" },
      { id: 739, title: "Daily Temperatures", difficulty: "Medium", slug: "daily-temperatures" },
      { id: 84,  title: "Largest Rectangle in Histogram", difficulty: "Hard", slug: "largest-rectangle-in-histogram" },
    ],
  },
  d07: {
    description: "Processes nodes level by level. Methodical. Boring. Correct.",
    deps: [],
    problems: [
      { id: 102, title: "Binary Tree Level Order Traversal", difficulty: "Medium", slug: "binary-tree-level-order-traversal" },
      { id: 199, title: "Binary Tree Right Side View", difficulty: "Medium", slug: "binary-tree-right-side-view" },
      { id: 994, title: "Rotting Oranges", difficulty: "Medium", slug: "rotting-oranges" },
    ],
  },
  d08: {
    description: "Pre-compute once, answer anything. Laziness with elegance.",
    deps: [],
    problems: [
      { id: 303, title: "Range Sum Query - Immutable", difficulty: "Easy", slug: "range-sum-query-immutable" },
      { id: 560, title: "Subarray Sum Equals K", difficulty: "Medium", slug: "subarray-sum-equals-k" },
      { id: 304, title: "Range Sum Query 2D", difficulty: "Medium", slug: "range-sum-query-2d-immutable" },
    ],
  },
  d09: {
    description: "The prerequisite to half of everything. Respect it.",
    deps: [],
    problems: [
      { id: 912, title: "Sort an Array", difficulty: "Medium", slug: "sort-an-array" },
      { id: 75,  title: "Sort Colors", difficulty: "Medium", slug: "sort-colors" },
      { id: 179, title: "Largest Number", difficulty: "Medium", slug: "largest-number" },
    ],
  },
  d10: {
    description: "To understand recursion, you must first understand recursion.",
    deps: [],
    problems: [
      { id: 21,  title: "Merge Two Sorted Lists", difficulty: "Easy", slug: "merge-two-sorted-lists" },
      { id: 206, title: "Reverse Linked List", difficulty: "Easy", slug: "reverse-linked-list" },
      { id: 104, title: "Maximum Depth of Binary Tree", difficulty: "Easy", slug: "maximum-depth-of-binary-tree" },
    ],
  },
  d11: {
    description: "Characters have feelings too. Handle them with care.",
    deps: [],
    problems: [
      { id: 125, title: "Valid Palindrome", difficulty: "Easy", slug: "valid-palindrome" },
      { id: 242, title: "Valid Anagram", difficulty: "Easy", slug: "valid-anagram" },
      { id: 5,   title: "Longest Palindromic Substring", difficulty: "Medium", slug: "longest-palindromic-substring" },
    ],
  },
  d12: {
    description: "Navigating 2D arrays since programmers had two dimensions.",
    deps: [],
    problems: [
      { id: 200, title: "Number of Islands", difficulty: "Medium", slug: "number-of-islands" },
      { id: 73,  title: "Set Matrix Zeroes", difficulty: "Medium", slug: "set-matrix-zeroes" },
      { id: 54,  title: "Spiral Matrix", difficulty: "Medium", slug: "spiral-matrix" },
    ],
  },

  // ── Tier 2 ────────────────────────────────────────────────────────────────
  d13: {
    description: "Go deep or go home. Then unwind the call stack.",
    deps: ["d10", "d07"],
    problems: [
      { id: 104, title: "Maximum Depth of Binary Tree", difficulty: "Easy", slug: "maximum-depth-of-binary-tree" },
      { id: 543, title: "Diameter of Binary Tree", difficulty: "Easy", slug: "diameter-of-binary-tree" },
      { id: 124, title: "Binary Tree Maximum Path Sum", difficulty: "Hard", slug: "binary-tree-maximum-path-sum" },
    ],
  },
  d14: {
    description: "Trees with commitment issues. Explore every dark corner.",
    deps: ["d10", "d12"],
    problems: [
      { id: 133, title: "Clone Graph", difficulty: "Medium", slug: "clone-graph" },
      { id: 417, title: "Pacific Atlantic Water Flow", difficulty: "Medium", slug: "pacific-atlantic-water-flow" },
      { id: 130, title: "Surrounded Regions", difficulty: "Medium", slug: "surrounded-regions" },
    ],
  },
  d15: {
    description: "Shortest path? Politely ask all neighbours first.",
    deps: ["d07"],
    problems: [
      { id: 127,  title: "Word Ladder", difficulty: "Hard", slug: "word-ladder" },
      { id: 1091, title: "Shortest Path in Binary Matrix", difficulty: "Medium", slug: "shortest-path-in-binary-matrix" },
      { id: 286,  title: "Walls and Gates", difficulty: "Medium", slug: "walls-and-gates" },
    ],
  },
  d16: {
    description: "Overlapping subproblems meet memoization. Beautiful laziness.",
    deps: ["d10", "d05"],
    problems: [
      { id: 70,  title: "Climbing Stairs", difficulty: "Easy", slug: "climbing-stairs" },
      { id: 198, title: "House Robber", difficulty: "Medium", slug: "house-robber" },
      { id: 322, title: "Coin Change", difficulty: "Medium", slug: "coin-change" },
    ],
  },
  d17: {
    description: "Two dimensions of pain. Or one elegant table.",
    deps: ["d16", "d08", "d12"],
    problems: [
      { id: 62,   title: "Unique Paths", difficulty: "Medium", slug: "unique-paths" },
      { id: 1143, title: "Longest Common Subsequence", difficulty: "Medium", slug: "longest-common-subsequence" },
      { id: 72,   title: "Edit Distance", difficulty: "Medium", slug: "edit-distance" },
    ],
  },
  d18: {
    description: "Try everything. Fail fast. Blame the last choice.",
    deps: ["d10", "d13"],
    problems: [
      { id: 46, title: "Permutations", difficulty: "Medium", slug: "permutations" },
      { id: 78, title: "Subsets", difficulty: "Medium", slug: "subsets" },
      { id: 51, title: "N-Queens", difficulty: "Hard", slug: "n-queens" },
    ],
  },
  d19: {
    description: "Never fetch the whole crowd. Just ask for the best.",
    deps: ["d09"],
    problems: [
      { id: 215, title: "Kth Largest Element in an Array", difficulty: "Medium", slug: "kth-largest-element-in-an-array" },
      { id: 23,  title: "Merge K Sorted Lists", difficulty: "Hard", slug: "merge-k-sorted-lists" },
      { id: 295, title: "Find Median from Data Stream", difficulty: "Hard", slug: "find-median-from-data-stream" },
    ],
  },
  d20: {
    description: "Because engineers love schedules and hate overlaps.",
    deps: ["d09", "d01"],
    problems: [
      { id: 56,  title: "Merge Intervals", difficulty: "Medium", slug: "merge-intervals" },
      { id: 57,  title: "Insert Interval", difficulty: "Medium", slug: "insert-interval" },
      { id: 435, title: "Non-overlapping Intervals", difficulty: "Medium", slug: "non-overlapping-intervals" },
    ],
  },
  d21: {
    description: "Numbers know their address. Just escort them home.",
    deps: ["d09"],
    problems: [
      { id: 268, title: "Missing Number", difficulty: "Easy", slug: "missing-number" },
      { id: 41,  title: "First Missing Positive", difficulty: "Hard", slug: "first-missing-positive" },
      { id: 287, title: "Find the Duplicate Number", difficulty: "Medium", slug: "find-the-duplicate-number" },
    ],
  },
  d22: {
    description: "You only need the All-Stars, not the whole roster.",
    deps: ["d19", "d05"],
    problems: [
      { id: 347, title: "Top K Frequent Elements", difficulty: "Medium", slug: "top-k-frequent-elements" },
      { id: 973, title: "K Closest Points to Origin", difficulty: "Medium", slug: "k-closest-points-to-origin" },
      { id: 692, title: "Top K Frequent Words", difficulty: "Medium", slug: "top-k-frequent-words" },
    ],
  },
  d23: {
    description: "If you can verify an answer, you can binary search for it.",
    deps: ["d04"],
    problems: [
      { id: 875,  title: "Koko Eating Bananas", difficulty: "Medium", slug: "koko-eating-bananas" },
      { id: 1011, title: "Capacity to Ship Packages", difficulty: "Medium", slug: "capacity-to-ship-packages-within-d-days" },
      { id: 410,  title: "Split Array Largest Sum", difficulty: "Hard", slug: "split-array-largest-sum" },
    ],
  },
  d24: {
    description: "Pointing backwards on purpose. Pointer therapy in action.",
    deps: ["d03", "d10"],
    problems: [
      { id: 206, title: "Reverse Linked List", difficulty: "Easy", slug: "reverse-linked-list" },
      { id: 92,  title: "Reverse Linked List II", difficulty: "Medium", slug: "reverse-linked-list-ii" },
      { id: 25,  title: "Reverse Nodes in K-Group", difficulty: "Hard", slug: "reverse-nodes-in-k-group" },
    ],
  },

  // ── Tier 3 ────────────────────────────────────────────────────────────────
  d25: {
    description: "A tree that autocompletes your thoughts before you finish.",
    deps: ["d13", "d11"],
    problems: [
      { id: 208, title: "Implement Trie (Prefix Tree)", difficulty: "Medium", slug: "implement-trie-prefix-tree" },
      { id: 211, title: "Design Add and Search Words", difficulty: "Medium", slug: "design-add-and-search-words-data-structure" },
      { id: 212, title: "Word Search II", difficulty: "Hard", slug: "word-search-ii" },
    ],
  },
  d26: {
    description: "Are we connected? Let me phone a parent… fast.",
    deps: ["d21"],
    problems: [
      { id: 547, title: "Number of Provinces", difficulty: "Medium", slug: "number-of-provinces" },
      { id: 684, title: "Redundant Connection", difficulty: "Medium", slug: "redundant-connection" },
      { id: 323, title: "Number of Connected Components", difficulty: "Medium", slug: "number-of-connected-components-in-an-undirected-graph" },
    ],
  },
  d27: {
    description: "Course prereqs as a graph. You've already lived this problem.",
    deps: ["d14", "d15"],
    problems: [
      { id: 207, title: "Course Schedule", difficulty: "Medium", slug: "course-schedule" },
      { id: 210, title: "Course Schedule II", difficulty: "Medium", slug: "course-schedule-ii" },
      { id: 310, title: "Minimum Height Trees", difficulty: "Medium", slug: "minimum-height-trees" },
    ],
  },
  d28: {
    description: "Greedy, but smarter. The algorithm behind your GPS.",
    deps: ["d15", "d19"],
    problems: [
      { id: 743,  title: "Network Delay Time", difficulty: "Medium", slug: "network-delay-time" },
      { id: 787,  title: "Cheapest Flights Within K Stops", difficulty: "Medium", slug: "cheapest-flights-within-k-stops" },
      { id: 1514, title: "Path with Maximum Probability", difficulty: "Medium", slug: "path-with-maximum-probability" },
    ],
  },
  d29: {
    description: "Range queries so fast it should be illegal.",
    deps: ["d08", "d22"],
    problems: [
      { id: 307, title: "Range Sum Query - Mutable", difficulty: "Medium", slug: "range-sum-query-mutable" },
      { id: 315, title: "Count of Smaller Numbers After Self", difficulty: "Hard", slug: "count-of-smaller-numbers-after-self" },
      { id: 493, title: "Reverse Pairs", difficulty: "Hard", slug: "reverse-pairs" },
    ],
  },
  d30: {
    description: "A stack with an obsession for order. Strangely powerful.",
    deps: ["d06", "d19"],
    problems: [
      { id: 739, title: "Daily Temperatures", difficulty: "Medium", slug: "daily-temperatures" },
      { id: 84,  title: "Largest Rectangle in Histogram", difficulty: "Hard", slug: "largest-rectangle-in-histogram" },
      { id: 42,  title: "Trapping Rain Water", difficulty: "Hard", slug: "trapping-rain-water" },
    ],
  },
  d31: {
    description: "The universe runs on zeros and ones. Might as well exploit it.",
    deps: ["d10"],
    problems: [
      { id: 191, title: "Number of 1 Bits", difficulty: "Easy", slug: "number-of-1-bits" },
      { id: 338, title: "Counting Bits", difficulty: "Easy", slug: "counting-bits" },
      { id: 136, title: "Single Number", difficulty: "Easy", slug: "single-number" },
    ],
  },
  d32: {
    description: "Make the locally optimal choice and pray it holds globally.",
    deps: ["d23", "d09"],
    problems: [
      { id: 55,  title: "Jump Game", difficulty: "Medium", slug: "jump-game" },
      { id: 45,  title: "Jump Game II", difficulty: "Medium", slug: "jump-game-ii" },
      { id: 134, title: "Gas Station", difficulty: "Medium", slug: "gas-station" },
    ],
  },
  d33: {
    description: "The final boss. Bring your dp table and your patience.",
    deps: ["d16", "d17", "d18"],
    problems: [
      { id: 416, title: "Partition Equal Subset Sum", difficulty: "Medium", slug: "partition-equal-subset-sum" },
      { id: 300, title: "Longest Increasing Subsequence", difficulty: "Medium", slug: "longest-increasing-subsequence" },
      { id: 115, title: "Distinct Subsequences", difficulty: "Hard", slug: "distinct-subsequences" },
    ],
  },
  d34: {
    description: "Connect everything for minimum cost. Pure engineering philosophy.",
    deps: ["d14", "d19"],
    problems: [
      { id: 1584, title: "Min Cost to Connect All Points", difficulty: "Medium", slug: "min-cost-to-connect-all-points" },
      { id: 1135, title: "Connecting Cities With Minimum Cost", difficulty: "Medium", slug: "connecting-cities-with-minimum-cost" },
      { id: 1168, title: "Optimize Water Distribution", difficulty: "Hard", slug: "optimize-water-distribution-in-a-village" },
    ],
  },
};
