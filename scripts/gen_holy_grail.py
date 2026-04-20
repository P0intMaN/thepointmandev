"""Generate lesson stubs for the Holy Grail mega course."""
import pathlib

BASE = pathlib.Path("C:/Dev/thepointmandev/content/courses/holy-grail")
DATE = "2026-04-19"
COURSE_SLUG = "holy-grail"

# (subCourse, globalLessonNumber, file_slug, title, description)
LESSONS = [
    # Sub-course 0: The Machine Beneath the Machine
    (0, 1,  "what-is-a-bit",           "What Is a Bit?",                      "From transistors to logic gates to binary representation. Why computers speak in 0s and 1s."),
    (0, 2,  "bytes-and-endianness",    "Bytes, Words, and Endianness",         "Big-endian vs little-endian, how byte order affects network protocols and serialization bugs."),
    (0, 3,  "number-representation",   "Number Representation",                "Unsigned integers, two's complement, and IEEE 754 floating point. Why 0.1 + 0.2 is not 0.3."),
    (0, 4,  "character-encodings",     "Character Encodings",                  "ASCII, UTF-8, UTF-16, UTF-32. Why Java's char is 16 bits and why that is a lie."),
    (0, 5,  "memory-hierarchy",        "The Memory Hierarchy",                 "Registers, L1/L2/L3, RAM, disk. Latency numbers every programmer should know, in nanoseconds."),
    (0, 6,  "cache-lines",             "Cache Lines and False Sharing",        "64-byte cache lines, associativity, the MESI protocol, and why false sharing destroys multi-threaded performance."),
    (0, 7,  "virtual-memory",          "Virtual Memory, Pages, and TLB",       "Address translation, page faults, TLB misses, and what malloc actually does under the hood."),
    (0, 8,  "stack-vs-heap",           "Stack vs Heap",                        "Frame pointers, calling conventions, stack overflow mechanics, and heap fragmentation."),
    (0, 9,  "assembly-primer",         "Assembly Primer",                      "x86-64 registers, mov, add, jmp, call, ret. Reading disassembly of simple Java programs."),
    # Sub-course 1: The JVM as Your Operating System
    (1, 10, "jvm-architecture",        "JVM Architecture",                     "Class loader, method area, heap, stack, PC registers, and native method stack — the full picture."),
    (1, 11, "object-layout",           "Object Layout in the Heap",            "Mark word, class pointer, instance data, alignment padding. Why an Integer is 16 bytes, not 4."),
    (1, 12, "compressed-oops",         "Compressed OOPs",                      "Ordinary Object Pointers, the 32GB heap limit, and how the JVM encodes 64-bit references in 32 bits."),
    (1, 13, "primitives-vs-boxed",     "Primitives vs Boxed Types",            "Autoboxing costs in tight loops, IntStream vs Stream of Integer, when boxing becomes a bottleneck."),
    (1, 14, "java-references",         "Java Reference Types",                 "Strong, soft, weak, and phantom references. When each is the right tool and how they interact with GC."),
    (1, 15, "gc-fundamentals",         "Garbage Collection Fundamentals",      "Mark-sweep, generational hypothesis, young/old gen, stop-the-world pauses, G1, ZGC at a conceptual level."),
    (1, 16, "escape-analysis",         "Escape Analysis and Stack Allocation",  "When the JIT eliminates heap allocation entirely, scalar replacement, and the limits of escape analysis."),
    (1, 17, "jit-compilation",         "JIT Compilation",                      "C1, C2 compilers, inlining, loop unrolling, vectorization, and why microbenchmarks lie without JMH."),
    (1, 18, "measuring-memory",        "Measuring Memory",                     "Instrumentation.getObjectSize(), Java Object Layout tool, and computing exact byte sizes of every structure you build."),
    # Sub-course 2: Arrays — The Hard and Deep Way
    (2, 19, "arrays-in-memory",        "Arrays in Memory",                     "Contiguous allocation, address arithmetic base + i * sizeof(T), and why O(1) random access is mechanical."),
    (2, 20, "cache-friendly-traversal","Cache-Friendly Traversal",             "Sequential vs strided vs random access. Measured performance difference on a 1GB array. Row-major vs column-major."),
    (2, 21, "multidimensional-arrays", "Multi-Dimensional Arrays",             "Why int[][] is an array of arrays and the cache implications. True 2D block alternatives."),
    (2, 22, "arraylist-from-scratch",  "Building ArrayList from Scratch",      "Growth factor choice, amortized analysis via the banker's and aggregate methods, full O(1) amortized proof."),
    (2, 23, "arraylist-vs-array",      "ArrayList vs Array",                   "Capacity vs size, the cost of remove(0), why System.arraycopy is a JVM intrinsic."),
    (2, 24, "dynamic-array-deletion",  "Dynamic Array Deletion Strategies",    "Shrink-on-quarter-full, formal amortized bounds under mixed insert/delete workloads."),
    (2, 25, "circular-buffers",        "Circular Buffers and Ring Buffers",    "Implementation from scratch, when they beat ArrayDeque, use in the LMAX Disruptor."),
    (2, 26, "sparse-arrays",           "Sparse Arrays and Their Representations", "Dictionary-based, CSR, and bitmap-indexed sparse representations and when to use each."),
    (2, 27, "bit-arrays",              "Bit Arrays and Bitsets",               "Packing 64 booleans into a long, building BitSet from scratch, population count, and Brian Kernighan's algorithm."),
    # Sub-course 3: Linked Structures
    (3, 28, "reference-semantics",     "Reference Semantics in Java",          "What a reference actually is, heap layout of a linked node, and why Java has no pointers — except it does."),
    (3, 29, "singly-linked-list",      "Singly Linked List from Scratch",      "Insert, delete, search, reverse iterative and recursive. Memory footprint per node — prove it is 24 bytes minimum."),
    (3, 30, "doubly-linked-list",      "Doubly Linked List",                   "Why Java's LinkedList is doubly linked. Trade-off: 8 extra bytes per node for O(1) reverse traversal."),
    (3, 31, "circular-linked-lists",   "Circular Linked Lists",                "Implementation, the Josephus problem, and round-robin schedulers."),
    (3, 32, "cache-hostility",         "Cache Hostility of Linked Lists",      "Why a linked list is 10-100x slower than an array for traversal despite identical asymptotic complexity. Measured on real hardware."),
    (3, 33, "floyds-cycle-detection",  "Floyd's Cycle Detection",              "Tortoise and hare algorithm with full mathematical proof of correctness and meeting point derivation."),
    (3, 34, "skip-lists",              "Skip Lists",                           "Probabilistic balancing, expected O(log n) proof via geometric distribution of levels. Used in Redis sorted sets."),
    (3, 35, "unrolled-linked-lists",   "Unrolled Linked Lists",                "Hybrid of array and linked list, cache-friendlier traversal, and when the trade-off wins."),
    (3, 36, "xor-linked-lists",        "XOR Linked Lists",                     "Doubly-linked in O(1) extra space via XOR pointer trick. Why you would never ship this, and why it is beautiful anyway."),
    # Sub-course 4: Stacks, Queues, and Deques
    (4, 37, "stack-adt",               "Stack ADT",                            "Array-backed vs linked-backed implementations, trade-offs, and why java.util.Stack is a historical mistake."),
    (4, 38, "queue-adt",               "Queue ADT",                            "The naive array implementation's O(n) dequeue problem and the circular buffer fix."),
    (4, 39, "deque-from-scratch",      "Deque from Scratch",                   "Building ArrayDeque, the power-of-two capacity trick for fast modulo, and resizing strategy."),
    (4, 40, "monotonic-stacks-queues", "Monotonic Stacks and Queues",          "Sliding window maximum in O(n) amortized. Proof of amortization via the accounting method."),
    (4, 41, "expression-evaluation",   "Expression Evaluation",                "Infix to postfix via Shunting-yard, balanced parenthesis checker, and eliminating recursion with an explicit stack."),
    (4, 42, "priority-queues-heaps",   "Priority Queues as Binary Heaps",      "Building PriorityQueue from scratch. Heapify in O(n) and the subtle proof most textbooks get wrong."),
    # Sub-course 5: Hashing
    (5, 43, "hash-function-theory",    "The Hash Function",                    "What makes a hash function good: uniformity, determinism, avalanche. The birthday paradox and expected collision rate."),
    (5, 44, "hash-functions-survey",   "Hash Functions Survey",                "FNV, MurmurHash, xxHash, SipHash. Why Java's String.hashCode() is weak and why that is a DoS vulnerability."),
    (5, 45, "separate-chaining",       "Separate Chaining",                    "Expected chain length under uniform hashing, load factor analysis, and the formal proof."),
    (5, 46, "open-addressing",         "Open Addressing",                      "Linear probing, quadratic probing, double hashing. Primary and secondary clustering. Knuth's expected probe formula."),
    (5, 47, "hashmap-from-scratch",    "Building HashMap from Scratch",        "Separate chaining implementation, resize triggers, rehashing cost, and the amortized O(1) proof."),
    (5, 48, "java8-treeification",     "Java 8 Treeification",                 "Why chains become red-black trees at threshold 8. The Poisson distribution math behind the choice."),
    (5, 49, "advanced-hashing",        "Robin Hood, Cuckoo, and Hopscotch",    "Robin Hood hashing, cuckoo hashing, hopscotch hashing. When each wins and what they trade."),
    (5, 50, "consistent-hashing",      "Consistent Hashing",                   "Used in Memcached and DynamoDB partitioning. Implementation from scratch with virtual nodes."),
    (5, 51, "bloom-filters",           "Bloom Filters",                        "Probabilistic membership, derivation of optimal hash function count k, and the false positive rate formula."),
    (5, 52, "probabilistic-structures","Count-Min Sketch and HyperLogLog",     "Count-Min Sketch for frequency estimation, HyperLogLog for cardinality — both with full derivations."),
    (5, 53, "linkedhashmap-lru",       "LinkedHashMap and LRU Cache",          "The doubly-linked-list-plus-hashmap pattern, implementing LRU from scratch, and access-order vs insertion-order."),
    # Sub-course 6: Trees
    (6, 54, "binary-trees",            "Binary Trees",                         "Linked vs array representation, depth vs height vs level, balanced vs complete vs full vs perfect — the distinctions matter."),
    (6, 55, "tree-traversals",         "Tree Traversals",                      "Pre/in/post/level-order, recursive and iterative, and Morris traversal in O(1) space."),
    (6, 56, "binary-search-tree",      "Binary Search Tree",                   "Insert, delete three cases, search. Why unbalanced BSTs degenerate to O(n). Expected depth proof via harmonic numbers."),
    (6, 57, "avl-trees",               "AVL Trees from Scratch",               "Rotations, height invariant, and the proof that AVL height is at most 1.44 log2(n+2)."),
    (6, 58, "red-black-trees",         "Red-Black Trees from Scratch",         "The five invariants, proof that height is at most 2 log2(n+1), and why Java's TreeMap uses RB over AVL."),
    (6, 59, "b-trees",                 "B-Trees and B+ Trees",                 "The fan-out argument, why disk-backed databases use them, minimum degree, splits, and merges."),
    (6, 60, "segment-trees",           "Segment Trees",                        "Range query, range update, and lazy propagation — from scratch with full implementation."),
    (6, 61, "fenwick-trees",           "Fenwick Trees",                        "Prefix sums in O(log n) with O(n) space. The bit-trick derivation explained from first principles."),
    (6, 62, "tries",                   "Tries and Radix Trees",                "Prefix trees, compressed tries, Patricia tries. Used in routing tables and autocomplete engines."),
    (6, 63, "suffix-structures",       "Suffix Trees and Suffix Arrays",       "Substring search in O(m), Ukkonen's algorithm conceptually, DC3/SA-IS for suffix arrays."),
    (6, 64, "treaps",                  "Treaps",                               "Randomized BSTs, expected O(log n) with probabilistic proofs, and the elegant merge/split interface."),
    (6, 65, "splay-trees",             "Splay Trees",                          "Self-adjusting trees, amortized O(log n) via potential function, and the access lemma."),
    # Sub-course 7: Heaps and Priority Structures
    (7, 66, "binary-heap-deep",        "Binary Heap Deep Dive",                "Array representation, heapify-up/down, build-heap in O(n), the linear-time proof via the geometric series sum."),
    (7, 67, "d-ary-heaps",             "D-ary Heaps",                          "Cache efficiency trade-off, when d=4 beats d=2, and the optimal fan-out for your cache line size."),
    (7, 68, "binomial-heaps",          "Binomial Heaps",                       "Mergeable heaps in O(log n), the binomial tree structure and why it supports merge efficiently."),
    (7, 69, "fibonacci-heaps",         "Fibonacci Heaps",                      "Amortized O(1) decrease-key, the potential function proof, and why they are theoretically beautiful but rarely used."),
    (7, 70, "pairing-heaps",           "Pairing Heaps",                        "The practical Fibonacci heap: simpler to implement, competitive in practice, complex to analyze."),
    (7, 71, "leftist-skew-heaps",      "Leftist Trees and Skew Heaps",         "Leftist property, rank, merge in O(log n), and skew heaps as the randomized self-adjusting variant."),
    # Sub-course 8: Graphs
    (8, 72, "graph-representations",   "Graph Representations",                "Adjacency matrix vs adjacency list vs edge list. Space and time trade-offs for dense vs sparse graphs."),
    (8, 73, "bfs-and-dfs",             "BFS and DFS from Scratch",             "Iterative DFS with an explicit stack, BFS for shortest paths in unweighted graphs, and their memory trade-offs."),
    (8, 74, "topological-sort",        "Topological Sort",                     "Kahn's algorithm and DFS-based topological sort. Detecting cycles in directed graphs."),
    (8, 75, "strongly-connected",      "Strongly Connected Components",        "Tarjan's and Kosaraju's algorithms with full proof of correctness."),
    (8, 76, "minimum-spanning-trees",  "Minimum Spanning Trees",               "Kruskal's with Union-Find and Prim's with binary heap. The cut property proof."),
    (8, 77, "union-find",              "Union-Find / Disjoint Set Union",      "Path compression and union by rank. The near-constant alpha(n) inverse Ackermann function."),
    (8, 78, "shortest-paths",          "Single-Source Shortest Paths",         "Why Dijkstra fails on negative edges, Bellman-Ford correctness proof, and SPFA."),
    (8, 79, "all-pairs-shortest",      "All-Pairs Shortest Paths",             "Floyd-Warshall DP formulation and Johnson's algorithm for sparse graphs."),
    (8, 80, "max-flow",                "Max Flow",                             "Ford-Fulkerson, Edmonds-Karp O(VE^2) proof, Dinic's O(V^2 E), and min-cut max-flow duality."),
    (8, 81, "bipartite-matching",      "Bipartite Matching",                   "Hopcroft-Karp algorithm, augmenting paths, and applications in scheduling and assignment problems."),
    (8, 82, "a-star-search",           "A* Search",                            "Admissible and consistent heuristics, why consistency implies optimality, and practical pathfinding."),
    (8, 83, "np-hard-graphs",          "NP-Hard Graph Problems",               "Graph coloring, Hamiltonian paths, TSP. When to recognize you are in NP-hard territory and what to do about it."),
    # Sub-course 9: Sorting and Searching
    (9, 84, "comparison-lower-bound",  "The Comparison Sort Lower Bound",      "Omega(n log n) decision tree proof via Stirling's approximation. Why you cannot do better with comparisons alone."),
    (9, 85, "simple-sorts",            "Insertion, Selection, and Bubble",     "Why they exist pedagogically and why insertion sort is actually used in practice for small n and nearly-sorted input."),
    (9, 86, "merge-sort",              "Merge Sort",                           "Recurrence T(n) = 2T(n/2) + O(n), Master Theorem, in-place merge sort, and external merge sort for data beyond RAM."),
    (9, 87, "quicksort",               "Quicksort",                            "Lomuto vs Hoare partition, median-of-three, randomized pivot, average-case O(n log n) proof via indicator random variables."),
    (9, 88, "heapsort",                "Heapsort",                             "In-place O(n log n) worst case, why it is cache-hostile, and when it earns its place as a fallback."),
    (9, 89, "introsort",               "Introsort",                            "The actual default in most languages: quicksort with heapsort fallback. The depth threshold and why it works."),
    (9, 90, "timsort",                 "Timsort",                              "Java's Arrays.sort for objects and Python's default: natural runs, galloping mode, and the 2015 stack depth bug."),
    (9, 91, "non-comparison-sorts",    "Non-Comparison Sorts",                 "Counting sort, radix sort, bucket sort. When O(n) is achievable and the hidden constants that make it lie."),
    (9, 92, "binary-search",           "Binary Search",                        "The three-line function ninety percent of engineers get wrong. Off-by-one analysis, lower/upper bound variants."),
    (9, 93, "advanced-search",         "Exponential, Interpolation, Ternary Search", "Exponential search for unbounded arrays, interpolation search on uniform distributions, ternary search on unimodal functions."),
    (9, 94, "selection-algorithms",    "Selection Algorithms",                 "Quickselect expected O(n), median-of-medians O(n) worst case with full proof."),
    # Sub-course 10: Algorithmic Paradigms
    (10, 95,  "divide-and-conquer",    "Divide and Conquer",                   "Master Theorem full statement and proof. Akra-Bazzi for non-standard recurrences."),
    (10, 96,  "dynamic-programming",   "Dynamic Programming",                  "Optimal substructure, overlapping subproblems, top-down memoization vs bottom-up tabulation, space optimization."),
    (10, 97,  "classic-dp",            "Classic DP Problems",                  "LIS in O(n log n) via patience sorting, LCS, edit distance, 0/1 knapsack, unbounded knapsack, matrix chain."),
    (10, 98,  "dp-advanced",           "DP on Trees, Graphs, Bitmask, Profile", "Tree DP, DAG DP, bitmask DP for small state spaces, and profile DP for grid problems."),
    (10, 99,  "greedy-algorithms",     "Greedy Algorithms",                    "Exchange argument proofs, activity selection, Huffman coding, job scheduling, and when greedy fails."),
    (10, 100, "matroids",              "Matroids",                             "The theoretical underpinning of when greedy works. Graphic matroids, partition matroids, and the greedy theorem."),
    (10, 101, "backtracking",          "Backtracking",                         "N-queens, Sudoku, subset sum, permutation generation. Pruning techniques that make it feasible."),
    (10, 102, "branch-and-bound",      "Branch and Bound",                     "B&B as systematic enumeration with pruning, bounding functions, and A* as a B&B instance."),
    (10, 103, "randomized-algorithms", "Randomized Algorithms",                "Las Vegas vs Monte Carlo, reservoir sampling, randomized quicksort re-analyzed with expectation."),
    (10, 104, "amortized-analysis",    "Amortized Analysis",                   "Aggregate, accounting, and potential methods with full proofs for dynamic arrays, splay trees, and Fibonacci heaps."),
    # Sub-course 11: Strings
    (11, 105, "naive-string-matching", "Naive String Matching",                "O(nm) naive algorithm, when it wins, and why it is the right baseline to beat."),
    (11, 106, "kmp",                   "Knuth-Morris-Pratt",                   "Failure function derivation from first principles, the amortized linear proof, and implementation from scratch."),
    (11, 107, "rabin-karp",            "Rabin-Karp",                           "Rolling hash, polynomial rolling hash, application to plagiarism detection and multi-pattern matching."),
    (11, 108, "boyer-moore",           "Boyer-Moore",                          "Bad character and good suffix heuristics, sublinear in practice, and when it beats KMP."),
    (11, 109, "aho-corasick",          "Aho-Corasick",                         "Multi-pattern matching via trie with failure links. Used in grep -f and network intrusion detection."),
    (11, 110, "z-algorithm",           "Z-Algorithm and Suffix Automaton",     "Z-function, suffix automaton construction, and the online substring search they enable."),
    (11, 111, "manachers",             "Manacher's Algorithm",                 "Longest palindromic substring in O(n). The elegant symmetry argument that makes it work."),
    (11, 112, "regex-engines",         "Regular Expression Engines",           "Thompson's NFA construction, NFA to DFA subset construction, and why PCRE can be exponential while Go's is not."),
    # Sub-course 12: The Frontier
    (12, 113, "persistent-structures", "Persistent Data Structures",           "Functional lists and persistent trees via structural sharing. Used in Clojure collections and Git internals."),
    (12, 114, "van-emde-boas",         "Van Emde Boas Trees",                  "O(log log U) operations for integer keys in a bounded universe. The recursive structure and why it works."),
    (12, 115, "wavelet-trees",         "Wavelet Trees",                        "Rank and select on general alphabets, construction, and applications in compressed text indexing."),
    (12, 116, "succinct-structures",   "Succinct Data Structures",             "Representing a tree in 2n + o(n) bits. LOUDS encoding, balanced parentheses representation."),
    (12, 117, "rope-data-structure",   "Rope Data Structure",                  "Efficient string editing via binary tree of string pieces. Used in VSCode and the original Rust compiler."),
    (12, 118, "spatial-indexing",      "KD-Trees, R-Trees, and Quadtrees",     "Spatial indexing for nearest-neighbor and range queries. Used in PostGIS, game engines, and geographic systems."),
    (12, 119, "lsm-trees",             "LSM Trees",                            "Log-structured merge trees, write amplification analysis, used in RocksDB, Cassandra, and HBase."),
    (12, 120, "crdts",                 "CRDTs",                                "Conflict-free replicated data types: G-Counter, PN-Counter, OR-Set. The math of eventual consistency."),
    (12, 121, "lock-free-structures",  "Lock-Free Data Structures",            "Compare-and-swap, the ABA problem, hazard pointers, and the Michael-Scott lock-free queue."),
    (12, 122, "cache-oblivious",       "Cache-Oblivious Algorithms",           "The cache-oblivious model, funnel sort, cache-oblivious B-trees, and the theoretical framework."),
    (12, 123, "streaming-algorithms",  "Streaming Algorithms",                 "Misra-Gries for frequent items, reservoir sampling, count-distinct via HyperLogLog with full derivation."),
    (12, 124, "online-algorithms",     "Online Algorithms",                    "Competitive analysis, the ski rental problem, LRU vs LFU analyzed as online algorithms."),
]

def write_stub(sub_course, lesson_num, file_slug, title, description):
    filename = f"sc{sub_course:02d}-{lesson_num:03d}-{file_slug}.mdx"
    filepath = BASE / filename
    content = f"""---
title: "{title}"
courseSlug: "{COURSE_SLUG}"
lessonNumber: {lesson_num}
subCourse: {sub_course}
description: "{description}"
date: "{DATE}"
draft: true
---

## Coming Soon

This lesson is being written.
"""
    filepath.write_text(content, encoding="utf-8")

for sub, num, slug, title, desc in LESSONS:
    write_stub(sub, num, slug, title, desc)

print(f"Created {len(LESSONS)} lesson stubs.")
