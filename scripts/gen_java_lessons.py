"""
Generates lesson stub .mdx files for all Java courses and patches
order/prerequisites/next into each course's _meta.mdx.
"""
import os, re

BASE = r"C:/Dev/thepointmandev/content/courses"
DATE = "2026-04-19"

# ── Course definitions ────────────────────────────────────────────────────────
# Each entry: slug -> { order, prerequisites, next, lessons: [(num, slug, title, desc)] }

COURSES = {

  # ── JVM & RUNTIME ────────────────────────────────────────────────────────

  "jvm-classloading": {
    "order": 1, "prerequisites": [], "next": "java-bytecode",
    "lessons": [
      (1,  "what-is-a-class",        "What Is a Class? — Binary Representation and Class Identity",             "What the JVM considers a class, the structure of a .class file, and why class identity depends on both the name and the ClassLoader that loaded it."),
      (2,  "classloader-hierarchy",  "The ClassLoader Hierarchy — Bootstrap, Platform and Application",         "The three built-in ClassLoaders, what each is responsible for loading, and the JDK 9 change that replaced Extension with Platform ClassLoader."),
      (3,  "parent-delegation",      "The Parent Delegation Model — Why It Exists and How to Break It",         "The delegation algorithm, why it prevents spoofing core JDK classes, and the legitimate cases (OSGi, hot deploy, web containers) that require breaking it."),
      (4,  "loading-phase",          "The Loading Phase — Finding and Reading the .class File",                  "How the JVM locates a class file (classpath, modules, network), what findClass() does, and how to intercept it in a custom ClassLoader."),
      (5,  "linking-verification",   "The Linking Phase I — Bytecode Verification",                             "What the verifier checks (type safety, stack depth, branch targets), why it exists, and the trusted flag that skips verification for JDK classes."),
      (6,  "linking-preparation",    "The Linking Phase II — Preparation and Resolution",                       "Default-value allocation for static fields during preparation, and how symbolic references in the constant pool are resolved to actual memory addresses."),
      (7,  "initialisation-phase",   "The Initialisation Phase — static Blocks and the Ordering Guarantee",     "The <clinit> method, the six triggers that force initialisation, the class initialisation lock that prevents races, and the circularity deadlock trap."),
      (8,  "class-identity",         "Class Identity — Same Name, Different ClassLoader = Different Type",       "Why casting between classes with the same name from different ClassLoaders throws ClassCastException, and how to exploit this for isolation."),
      (9,  "custom-classloaders",    "Custom ClassLoaders — Writing One from Scratch",                          "Extending ClassLoader, overriding findClass(), defining bytes into a class, and building a simple URLClassLoader replacement that logs every load."),
      (10, "jpms-classloading",      "JPMS and ClassLoading — How Modules Changed the Hierarchy",               "Named vs unnamed modules, the module layer, how JPMS enforces package encapsulation, and why --add-opens is the escape hatch for legacy frameworks."),
    ]
  },

  "java-bytecode": {
    "order": 2, "prerequisites": ["jvm-classloading"], "next": "jvm-memory-regions",
    "lessons": [
      (1,  "what-is-bytecode",         "What Is Bytecode? — The Contract Between javac and the JVM",             "The platform-neutral binary format javac produces, how the JVM consumes it, and why this indirection is the key to Java's portability promise."),
      (2,  "javap-deep-dive",          "javap Deep Dive — Disassembling Class Files",                            "javap -c -verbose output explained line by line: access flags, constant pool entries, code attribute, local variable table, and line number table."),
      (3,  "constant-pool",            "The Constant Pool — The JVM's Symbol Table",                             "CONSTANT_Class, CONSTANT_Methodref, CONSTANT_String, CONSTANT_Integer entries, symbolic vs resolved references, and why strings in code are not always String objects."),
      (4,  "operand-stack",            "The Operand Stack — Stack-Based Computation vs Register Machines",        "How arithmetic flows through push/pop sequences, the category-1 vs category-2 type split (long/double take two slots), and stack depth limits."),
      (5,  "method-invocation",        "Method Invocation — invokevirtual vs invokeinterface vs invokestatic",    "The four invocation opcodes, why invokeinterface is slower than invokevirtual, invokespecial for constructors and super calls, and receiver type resolution."),
      (6,  "invokedynamic",            "invokedynamic — How Lambda Expressions Are Actually Compiled",            "The bootstrap method, CallSite, MethodHandle, LambdaMetafactory, and why invokedynamic lets the JVM inline lambdas better than anonymous classes."),
      (7,  "bridge-methods",           "Bridge Methods — The Compiler's Erasure Workaround",                     "Why type erasure forces the compiler to emit synthetic bridge methods for covariant overrides and generic interface implementations, with bytecode proof."),
      (8,  "reading-real-bytecode",    "Reading Real Bytecode — Walking Through a Non-Trivial Class",             "Disassemble a class with generics, a lambda, a try-with-resources, and a switch expression — connecting each language feature to its bytecode representation."),
    ]
  },

  "jvm-memory-regions": {
    "order": 3, "prerequisites": ["jvm-classloading"], "next": "garbage-collection",
    "lessons": [
      (1,  "jvm-memory-map",          "The JVM Memory Map — Every Region and Its Purpose",                      "A complete map of all JVM memory regions: what exists, what each is for, which are per-thread vs shared, and which the GC manages vs which it doesn't."),
      (2,  "heap-structure",          "The Heap — Object Allocation and the Young/Old Divide",                   "Why the heap is split, TLAB (Thread-Local Allocation Buffer) for fast bump-pointer allocation, and what object layout looks like in memory."),
      (3,  "young-generation",        "The Young Generation — Eden, S0, S1 and the Minor GC Cycle",             "Object birth in Eden, survivor space ping-pong, the tenuring threshold, and why most objects die young (the generational hypothesis proven)."),
      (4,  "old-generation",          "The Old Generation — Tenuring, Promotion and Major GC",                   "When and how objects are promoted, what triggers a major GC, humongous object allocation directly into Old Gen, and the cost of Old Gen GC."),
      (5,  "metaspace",               "Metaspace — Class Metadata After PermGen (Java 8+)",                      "What moved from PermGen to Metaspace, what still lives there (class metadata, method bytecodes, interned strings), and how to tune its size."),
      (6,  "thread-stack",            "The Thread Stack — Frames, Local Variables and the Operand Stack",        "One stack per thread, one frame per method call, what a frame contains (local variable array, operand stack, frame data), and StackOverflowError triggers."),
      (7,  "off-heap-memory",         "Off-Heap Memory — Direct ByteBuffer and Native Allocations",             "ByteBuffer.allocateDirect() bypasses the GC heap, the phantom reference finaliser that frees it, and why Netty and Kafka use off-heap aggressively."),
      (8,  "object-memory-layout",    "Object Memory Layout — Mark Word, Class Pointer and Field Alignment",     "The object header (mark word: GC state, identity hash, lock bits), class pointer, field ordering by the JVM (not declaration order), and compressed oops."),
      (9,  "oom-stackoverflow",       "OutOfMemoryError vs StackOverflowError — What Actually Triggers Each",    "Heap exhaustion vs stack exhaustion, the seven OOM message variants and what each means, and how to configure stack depth per thread."),
      (10, "memory-leak-taxonomy",    "Memory Leak Taxonomy — Static Maps, ClassLoaders, ThreadLocals, Listeners", "The four categories of JVM memory leaks with code examples, Eclipse MAT heap dump analysis, the dominator tree, and the retained vs shallow size distinction."),
    ]
  },

  "garbage-collection": {
    "order": 4, "prerequisites": ["jvm-memory-regions"], "next": "jit-compiler",
    "lessons": [
      (1,  "gc-first-principles",   "GC from First Principles — The Reachability Problem",                     "What makes an object live vs dead, the GC root set (stack refs, static fields, JNI, thread references), and why reference counting doesn't work."),
      (2,  "mark-sweep-compact",    "Mark, Sweep and Compact — The Three Phases",                              "Tri-colour marking, the sweep phase and fragmentation, compaction as the fix, Stop-the-World pause cost, and why compaction is the bottleneck."),
      (3,  "generational-hypothesis","The Generational Hypothesis — Why Generations Exist",                    "The empirical observation that most objects die young, how generations exploit this, and the remembered set problem (old-to-young pointers)."),
      (4,  "serial-gc",             "Serial GC — Single-Threaded Collection for Small Heaps",                  "-XX:+UseSerialGC, when it makes sense (embedded, small CLIs), the simple stop-the-world collect-everything approach, and its modern relevance."),
      (5,  "parallel-gc",           "Parallel GC — Multi-Threaded Stop-the-World for Throughput",              "-XX:+UseParallelGC, multiple GC threads during STW, throughput vs latency trade-off, and why it was the default before Java 9."),
      (6,  "cms-gc",                "CMS — Concurrent Mark Sweep (The History That Shaped G1)",                "Initial mark, concurrent mark, remark, concurrent sweep phases, the concurrent mode failure problem, and why CMS was deprecated in Java 9."),
      (7,  "g1gc-fundamentals",     "G1GC — Regions, Remembered Sets and Concurrent Marking",                  "The heap as a grid of equal-size regions, remembered sets per region, the concurrent marking cycle, and the 200ms pause target mechanism."),
      (8,  "g1gc-advanced",         "G1GC — Mixed Collections, Humongous Objects and Evacuation Failure",      "What a mixed collection is, humongous region allocation for large objects, to-space exhaustion (evacuation failure) and how G1 recovers."),
      (9,  "zgc",                   "ZGC — Load Barriers, Colored Pointers and Concurrent Relocation",         "The ZGC design: single-digit ms pauses at any heap size, load barriers as the key mechanism, colored (tagged) pointers, and concurrent relocation."),
      (10, "shenandoah",            "Shenandoah — Brooks Pointers and Concurrent Compaction",                  "Shenandoah's approach: Brooks forwarding pointers for concurrent compaction, the evacuation phase, and how it compares to ZGC."),
      (11, "gc-tuning",             "GC Tuning — Reading Logs, JVM Flags and Pause Optimization",              "-Xlog:gc*, -XX:MaxGCPauseMillis, -XX:+HeapDumpOnOutOfMemoryError, GCViewer, and the five-step tuning process that actually works."),
      (12, "gc-diagnosis",          "Diagnosing GC Problems — Allocation Storms, Promotion Failure, Full GC",  "Identifying allocation rate spikes, premature promotion, concurrent mode failure in GC logs, and the systematic approach to eliminating Full GC."),
    ]
  },

  "jit-compiler": {
    "order": 5, "prerequisites": ["jvm-memory-regions"], "next": None,
    "lessons": [
      (1,  "interpretation-profiling","Interpretation and Profiling — The Slow Start That Pays Off",           "The interpreter, invocation counters, back-edge counters, and how the JVM profiles hot code before committing to compilation."),
      (2,  "c1-compiler",            "The C1 Compiler — Fast, Lightly Optimised Code",                         "Compilation level 1-3 (C1), what optimisations C1 applies (inlining small methods, basic null checks), and when code is eligible for C1."),
      (3,  "c2-compiler",            "The C2 Compiler — Aggressive Optimisation from Profile Data",            "Compilation level 4 (C2), profile-guided optimisation, speculative deoptimisation, and why C2 can produce code faster than hand-written C in some cases."),
      (4,  "tiered-compilation",     "Tiered Compilation — The Five Levels of JIT",                            "Levels 0 (interpretation) through 4 (C2), how the JVM decides when to promote, and the -XX:+TieredCompilation flag and its impact on startup."),
      (5,  "method-inlining",        "Method Inlining — The Single Most Important JIT Optimisation",           "Why inlining matters (eliminates call overhead, enables further opts), the inlining budget, -XX:MaxInlineSize, and why final helps (monomorphic dispatch)."),
      (6,  "escape-analysis",        "Escape Analysis — Stack Allocation and Lock Elision",                    "How the JVM proves an object doesn't escape the method, stack-allocating it (no GC pressure), and eliminating synchronisation on non-escaping objects."),
      (7,  "loop-optimisations",     "Loop Optimisations — Unrolling, Vectorisation and Elimination",          "Loop unrolling for reduced branch overhead, auto-vectorisation with SIMD instructions, and dead-code elimination inside loops."),
      (8,  "on-stack-replacement",   "On-Stack Replacement — JIT-ing Code That Is Already Running",            "OSR replaces an interpreter frame with a compiled frame mid-execution (e.g. inside a long loop), how it works, and what limits it."),
      (9,  "deoptimisation",         "Deoptimisation — When JIT Assumptions Break",                            "Uncommon traps, deoptimisation triggers (class loading, type confusion), the cost of deoptimisation, and why JIT is a speculative optimiser."),
      (10, "jvm-profiling",          "JVM Profiling — JFR, async-profiler and Reading Flamegraphs",            "Java Flight Recorder event types, async-profiler's signal-based sampling (no safepoint bias), flamegraph reading, and allocation profiling."),
    ]
  },

  # ── JAVA LANGUAGE ─────────────────────────────────────────────────────────

  "java-type-system": {
    "order": 1, "prerequisites": [], "next": "java-strings-in-depth",
    "lessons": [
      (1, "eight-primitives",      "The Eight Primitives — Size, Range and Why They Exist",             "byte, short, int, long, float, double, char, boolean — their sizes, ranges, default values, and why Java has both primitives and objects."),
      (2, "stack-vs-heap-storage", "Stack Storage vs Heap Storage — Where Each Type Lives",              "Local primitive variables on the stack, objects on the heap, method parameters, and why this distinction matters for performance and nullability."),
      (3, "wrapper-classes",       "Wrapper Classes — int vs Integer and the Null Problem",              "Integer, Long, Double etc., when they're needed (generics, collections), and the NullPointerException that waits when you unbox a null."),
      (4, "autoboxing-unboxing",   "Autoboxing and Unboxing — The Magic and Its Cost",                   "Compiler-generated valueOf() and xxxValue() calls, the hidden object allocation in loops, and why List<int> is not allowed."),
      (5, "integer-cache",         "The Integer Cache — Why == Works Up to 127 and Fails at 128",       "The [-128, 127] cache in Integer.valueOf(), why the boundary exists, how to reproduce the trap, and how to extend it with -XX:AutoBoxCacheMax."),
      (6, "widening-narrowing",    "Widening and Narrowing Conversions — The Implicit and Explicit",     "Automatic widening (int to long), required cast for narrowing (long to int), data loss on narrowing, and promotion in method overload resolution."),
      (7, "type-promotion",        "Type Promotion in Expressions — Why byte + byte = int",             "The integer promotion rule, why arithmetic on byte/short always yields int, the compound assignment exception (+=), and float vs double precision."),
      (8, "var-local-inference",   "var (Java 10) — Local Type Inference and Its Limits",               "What var infers, what it cannot (fields, parameters, return types), the readability trade-off, and where it genuinely improves code."),
    ]
  },

  "java-oop-internals": {
    "order": 4, "prerequisites": ["java-type-system"], "next": "java-generics",
    "lessons": [
      (1,  "encapsulation-invariants",   "Encapsulation — Invariants, Defensive Copying and Tell-Don't-Ask",  "What encapsulation actually protects (class invariants), defensive copying for mutable fields, and the tell-don't-ask principle as the deeper goal."),
      (2,  "constructors-init-order",    "Constructors and Initialisation — The Order You Must Know",          "Static initialiser, instance initialiser, constructor body — exact order; the this() and super() constraint; and blank final field rules."),
      (3,  "constructor-override-trap",  "Calling Overridden Methods from Constructors — The Dangerous Trap",  "Why the superclass constructor sees the subclass override before the subclass is initialised, with a concrete NPE example and how to avoid it."),
      (4,  "vtable-dispatch",            "The Virtual Table (vtable) — How Method Dispatch Actually Works",    "The vtable data structure, one per class, slot inheritance and override, how invokevirtual uses it, and why dispatch is O(1)."),
      (5,  "overriding-overloading",     "Overriding vs Overloading vs Hiding — The Three Cases",             "Runtime polymorphism (overriding), compile-time selection (overloading), and static method hiding — with the @Override annotation as the guard."),
      (6,  "covariant-return",           "Covariant Return Types and the Bridge Method Connection",            "Covariant override (return type narrowing), how the compiler emits a synthetic bridge method to satisfy the original signature, bytecode proof."),
      (7,  "abstract-classes",           "Abstract Classes — State, Constructors and Partial Implementation",  "When abstract classes beat interfaces (shared state, constructor arguments), the abstract method contract, and template method as the natural pattern."),
      (8,  "interfaces-evolution",       "Interfaces from Java 7 to 17 — default, static, private, sealed",   "The interface evolution: default methods (Java 8), static methods, private methods (Java 9), sealed interfaces (Java 17) — and what each enables."),
      (9,  "is-a-vs-has-a",             "IS-A vs HAS-A — When Inheritance Is the Wrong Tool",               "Composition vs inheritance, the fragile base class problem, why IS-A should mean behavioural subtyping (LSP), and refactoring to composition."),
      (10, "final-and-jit",             "final and the JIT — How final Methods Enable Inlining",             "final prevents override, so the JVM can monomorphically inline calls, devirtualise, and go further with C2 optimisations — the performance angle."),
    ]
  },

  "java-generics": {
    "order": 5, "prerequisites": ["java-oop-internals"], "next": "collections-lists",
    "lessons": [
      (1,  "pre-generics-dark-age",    "The Pre-Generics Dark Age — Raw Types and ClassCastException Hell",    "Java before generics: Object-typed collections, mandatory casts everywhere, runtime ClassCastExceptions, and the design pressure that led to JSR-14."),
      (2,  "generic-classes-methods",  "Generic Classes and Methods — The Syntax Made Sensible",              "Type parameter declaration, bounded type parameters, generic methods vs generic classes, and how the compiler enforces type safety at compile time."),
      (3,  "bounded-type-parameters",  "Bounded Type Parameters — extends, super and Multiple Bounds",        "Upper bounds (<T extends Comparable<T>>), multiple bounds (<T extends A & B>), and why you can only have one class bound (class linearisation)."),
      (4,  "type-erasure",             "Type Erasure — What Actually Survives to Runtime",                    "The erasure algorithm (T becomes Object or bound), why instanceof List<String> is illegal, and how to use reflection to recover generic type info."),
      (5,  "bridge-methods-generics",  "Bridge Methods — The Compiler's Erasure Workaround in Bytecode",      "When and why the compiler synthesises bridge methods for generic overrides, what they look like in bytecode, and how they preserve polymorphism post-erasure."),
      (6,  "invariance",               "Invariance — Why List<Dog> Is Not a List<Animal>",                   "Parametric invariance, the add() argument, the get() return type — why allowing subtype polymorphism on generics would break type safety with a proof."),
      (7,  "covariance-extends",       "Covariance with ? extends T — Read-Only Flexibility",                 "The upper-bounded wildcard, what you can read (T), what you cannot write (anything), and the covariant Producer analogy."),
      (8,  "contravariance-super",     "Contravariance with ? super T — Write-Side Flexibility",              "The lower-bounded wildcard, what you can write (T and subtypes), what you cannot read (only Object), and the contravariant Consumer analogy."),
      (9,  "pecs",                     "PECS — Producer Extends, Consumer Super as a Practical Rule",         "Distilling wildcards into one rule: if a parameter produces T values use extends, if it consumes T values use super. Collections.copy() as the canonical example."),
      (10, "generic-limitations",      "Generic Limitations — new T(), instanceof, Primitive Types, Arrays",   "What you cannot do with generics (new T(), T[], instanceof), why each limitation exists (erasure), and the workarounds (Class<T> tokens, unchecked casts)."),
      (11, "heap-pollution-varargs",   "Heap Pollution and @SafeVarargs — The Varargs Danger",                "Why generic varargs parameters cause heap pollution, the compiler warning, @SafeVarargs as the suppression contract, and when it's safe to apply."),
      (12, "reflection-and-generics",  "Reflection and Generics — ParameterizedType and Type Tokens",         "java.lang.reflect.Type hierarchy, ParameterizedType.getActualTypeArguments(), and Gson/Jackson's super type token trick to recover erased types."),
      (13, "advanced-generic-patterns","Advanced Patterns — Recursive Generics, CRTP and Generic Builders",   "Recursive generics (<T extends Comparable<T>>), the Curiously Recurring Template Pattern for fluent builder return types, and self-referential APIs."),
    ]
  },

  "java-strings-in-depth": {
    "order": 2, "prerequisites": ["java-type-system"], "next": "java-exceptions-in-depth",
    "lessons": [
      (1, "string-immutability",    "String Immutability — Why Strings Cannot Change (and Why That's Good)", "The final char[] (later byte[]) backing field, why immutability enables the string pool, thread-safety, and use as HashMap keys."),
      (2, "string-pool-interning",  "The String Pool — Interning, Literals vs new String()",                 "The constant pool in the class file, the runtime string pool (Metaspace), how literals are interned automatically, and intern() to force it manually."),
      (3, "equals-vs-double-equals","== vs .equals() — The Classic Mistake and Why It Happens",              "Reference equality vs value equality, why the pool makes == work for literals (deceptively), and the canonical fix: always use equals()."),
      (4, "concatenation-internals","String Concatenation — What the Compiler Does With +",                  "javac's evolution: StringBuffer (Java 1), StringBuilder (Java 5), invokedynamic + StringConcatFactory (Java 9+). Bytecode proof. Why loops still hurt."),
      (5, "stringbuilder-internals","StringBuilder Internals — char[] Resizing and the Amortised Cost",       "The initial capacity (16), the doubling-plus-2 growth strategy, the amortised O(1) append analysis, and the toString() copy."),
      (6, "string-api-gotchas",     "String API Deep Dive — substring(), intern(), format() and the Gotchas", "substring() O(1) without copying (Java 7u6+), the String.format() performance cost, compareTo() vs compareToIgnoreCase(), and the strip() vs trim() Unicode difference."),
    ]
  },

  "java-exceptions-in-depth": {
    "order": 3, "prerequisites": ["java-type-system"], "next": "java-oop-internals",
    "lessons": [
      (1, "exception-hierarchy",         "The Exception Hierarchy — Throwable, Error, Exception, RuntimeException", "The full class hierarchy: Throwable splits into Error (don't catch) and Exception (may catch), RuntimeException as the unchecked branch."),
      (2, "checked-vs-unchecked",        "Checked vs Unchecked — The Original Design Intent and the Controversy",  "Why Gosling added checked exceptions, the forced-handling argument, the boilerplate counter-argument, and why modern Java (and other JVM languages) largely avoid them."),
      (3, "try-catch-finally-order",     "try-catch-finally — The Execution Order (Including the Surprising Cases)", "The guaranteed finally, what happens when both the try and the finally throw, when finally does NOT run (System.exit(), JVM crash), and return in finally."),
      (4, "try-with-resources-desugaring","try-with-resources — How the Compiler Desugars It",                   "The AutoCloseable contract, the generated finally, close() called even on exception, multiple resources (closed in reverse order), and nested TWR bugs."),
      (5, "suppressed-exceptions",       "Suppressed Exceptions — When Two Exceptions Happen at Once",            "The suppressed exception chain (addSuppressed), getSuppressed(), and how TWR correctly preserves both the original and the close() exception."),
      (6, "exception-chaining",          "Exception Chaining — initCause(), getCause() and the Stack Trace",      "Wrapping low-level exceptions in higher-level ones, the cause chain, preserving the root cause, and why losing the original exception is an anti-pattern."),
      (7, "custom-exception-design",     "Custom Exception Design — What to Extend, When to Add Fields",          "RuntimeException vs Exception choice, adding context fields (ids, codes), the serialisation requirement for Throwable, and the message convention."),
    ]
  },

  # ── JAVA COLLECTIONS ──────────────────────────────────────────────────────

  "collections-lists": {
    "order": 1, "prerequisites": ["java-generics"], "next": "collections-maps",
    "lessons": [
      (1, "list-contract",             "The List Contract — Random Access, Ordering and Duplicates",          "What the List interface guarantees: index-based access, insertion order preservation, null tolerance, and the RandomAccess marker interface."),
      (2, "arraylist-internals",       "ArrayList Internals — The Backing Array and Growth Strategy",         "Object[] elementData, size vs capacity, the growth formula (oldCapacity + oldCapacity >> 1), ensureCapacity(), and the trimToSize() tradeoff."),
      (3, "arraylist-operations",      "ArrayList: add(), remove(), indexOf() — The Actual Code Path",        "add(E) amortised O(1), add(int, E) O(n) shift, remove(int) vs remove(Object), indexOf() linear scan, and the null element handling."),
      (4, "arraylist-sublist",         "ArrayList: subList() — Views, Mutations and the Hidden CME Trap",     "subList() returns a view (not a copy), mutations through the view affect the original, structural modification of the original invalidates the view with CME."),
      (5, "fail-fast-iteration",       "Fail-Fast Iteration — modCount, Structural Modification and CME",     "The modCount field, what counts as structural modification, how the iterator checks it on every next() call, and the remove() exception via iterator.remove()."),
      (6, "linkedlist-internals",      "LinkedList Internals — The Doubly-Linked Node Structure",             "The Node<E> inner class (item, next, prev), the first/last pointers, how linkFirst/linkLast/unlink work, and memory overhead (24 bytes per node)."),
      (7, "linkedlist-when-matters",   "LinkedList: When O(1) Head/Tail Operations Actually Matter",          "Queue/Deque use cases where add/remove at head/tail is O(1), why it rarely wins over ArrayDeque in practice, and the cache-locality penalty."),
      (8, "arraylist-vs-linkedlist",   "ArrayList vs LinkedList — Cache Locality, Memory and the Real Benchmark", "CPU cache lines, spatial locality of arrays vs scattered node pointers, JMH benchmark results, and the verdict: ArrayDeque beats LinkedList for queues."),
      (9, "copyonwritearraylist",      "CopyOnWriteArrayList — The Snapshot Iterator and When to Pay the Copy Tax", "Full array copy on every write, iterator iterates over the snapshot (never throws CME), read-heavy use cases, and ConcurrentLinkedQueue as alternative."),
    ]
  },

  "collections-maps": {
    "order": 2, "prerequisites": ["java-generics"], "next": "collections-sets-queues",
    "lessons": [
      (1,  "hash-table-fundamentals",  "The Hash Table Data Structure — Arrays + Hash Functions from First Principles", "Separate chaining vs open addressing, the hash function contract, load factor, and the time-space trade-off that defines every Map implementation."),
      (2,  "hashcode-contract",        "The hashCode() Contract — Consistency, Equality and Distribution",    "The three hashCode() rules, the equals-implies-same-hashCode requirement, what bad distribution does to performance, and 31 as the prime multiplier."),
      (3,  "hashmap-bucket-array",     "HashMap: The Bucket Array and the Entry Chain",                       "The table[] array of Node<K,V>, the chain of nodes in each bucket, how the bucket index is computed (hash & (n-1)), and the initial capacity 16."),
      (4,  "hashmap-put",              "HashMap: put() — Hashing, Bucketing and Collision Resolution",         "The full put() code path: hash(), bucket index, key equality check, insert at head (Java 7) vs tail (Java 8), and the existing-key update branch."),
      (5,  "hashmap-load-factor",      "HashMap: The Load Factor and When resize() Triggers",                  "Default 0.75 load factor, threshold = capacity * loadFactor, why 0.75 balances memory and lookup cost, and when to pre-size with expected capacity."),
      (6,  "hashmap-treeification",    "HashMap: Java 8 Treeification — When Chains Become Red-Black Trees",  "The TREEIFY_THRESHOLD (8), UNTREEIFY_THRESHOLD (6), the TreeNode subclass, and how treeification protects against hash-flooding DoS attacks."),
      (7,  "hashmap-resize",           "HashMap: resize() Internals — Rehashing and the Java 7 Infinite Loop", "The resize operation (double capacity, rehash all entries), the Java 8 tail-insertion fix, and a reconstruction of the Java 7 infinite loop under concurrent access."),
      (8,  "hashmap-null-key",         "HashMap: Why Null Gets Special Treatment",                             "Null key is allowed (stored in bucket 0), null value is allowed, and why ConcurrentHashMap forbids both — the putForNullKey() legacy method."),
      (9,  "hashmap-thread-safety",    "HashMap: Thread-Safety — Why You Need ConcurrentHashMap",              "Why HashMap is not thread-safe (multiple operations are non-atomic), the specific failure modes, and when to use ConcurrentHashMap vs Collections.synchronizedMap()."),
      (10, "linkedhashmap-insertion",  "LinkedHashMap: Maintaining Insertion Order with an Extra Linked List",  "The before/after pointers added to each Entry, the doubly-linked list maintained in parallel with the bucket array, and why iteration is O(n)."),
      (11, "linkedhashmap-lru",        "LinkedHashMap: Access-Order Mode and Building a Proper LRU Cache",      "The accessOrder flag, how get() relinks the accessed entry to the tail, overriding removeEldestEntry() to implement a bounded LRU cache."),
      (12, "treemap-red-black",        "TreeMap: Red-Black Tree Properties — Self-Balancing Guarantees",       "The five Red-Black Tree invariants, rotation and recolouring to restore balance, O(log n) guaranteed for put/get/remove, and the Comparator contract."),
      (13, "treemap-navigable",        "TreeMap: NavigableMap Operations — floorKey, ceilingKey, headMap, tailMap", "The NavigableMap and SortedMap interfaces, range-view operations, the inclusive/exclusive boundary flags, and descendingMap() for reverse traversal."),
      (14, "weakmap-enummap",          "WeakHashMap and EnumMap — Specialised Maps for Specialised Needs",     "WeakHashMap's WeakReference keys and automatic eviction after GC (useful for caches), EnumMap's array-backed O(1) implementation, and their use cases."),
    ]
  },

  "collections-sets-queues": {
    "order": 3, "prerequisites": ["collections-maps"], "next": None,
    "lessons": [
      (1, "set-contract",          "The Set Contract — Uniqueness, equals() and hashCode()",               "What the Set interface guarantees (no duplicates), how uniqueness is enforced via equals() and hashCode(), and null-element policies per implementation."),
      (2, "hashset-internals",     "HashSet — A HashMap in Disguise",                                      "HashSet delegates entirely to a backing HashMap<E, PRESENT>, the PRESENT dummy value, and why this means all the HashMap performance rules apply."),
      (3, "linkedhashset",         "LinkedHashSet — Insertion-Order Iteration from a HashSet",             "Extends HashSet with a LinkedHashMap backing, the extra memory cost, and when you need predictable iteration order with Set semantics."),
      (4, "treeset",               "TreeSet — Sorted Iteration via Red-Black Tree Delegation",             "Backed by a TreeMap, the natural ordering requirement (Comparable) or Comparator, O(log n) operations, and NavigableSet methods (floor, ceiling, headSet)."),
      (5, "enumset",               "EnumSet — The Fastest Set You've Never Used",                          "Backed by a long bitmask (RegularEnumSet for <= 64 constants, JumboEnumSet beyond), O(1) add/contains/remove, and why it should always be used for enum collections."),
      (6, "queue-deque-contract",  "The Queue and Deque Contracts — FIFO, LIFO and Double-Ended",          "Queue's offer/poll/peek vs add/remove/element, Deque as a two-ended queue, and how the same interface serves both stack and queue use cases."),
      (7, "priorityqueue-heap",    "PriorityQueue — The Binary Heap Inside Java's Standard Library",       "The binary min-heap backed by Object[], the sift-up (offer) and sift-down (poll) operations, O(log n) enqueue/dequeue, O(n) contains, and the Comparator override."),
      (8, "arraydeque",            "ArrayDeque — The Right Stack and Queue Implementation (Not LinkedList)","Circular array with head/tail pointers, amortised O(1) for all deque operations, no null tolerance, better cache performance than LinkedList."),
    ]
  },

  # ── MODERN JAVA ───────────────────────────────────────────────────────────

  "java-lambdas-functional": {
    "order": 1, "prerequisites": ["java-generics"], "next": "java-streams-internals",
    "lessons": [
      (1, "anonymous-class-problem",    "The Problem — Why Anonymous Classes Were a Dead End",               "Six lines of boilerplate to express one computation, captured variable restrictions, the this ambiguity, and the JSR-335 design pressure."),
      (2, "lambda-syntax-target-typing","Lambda Expressions — Syntax, Target Typing and the SAM Rule",       "Expression vs block lambdas, the target type (what functional interface is expected), and the Single Abstract Method rule for eligibility."),
      (3, "closures-effectively-final", "Closures and Effectively Final — What Lambdas Can Capture and Why", "Captured variables must be effectively final, why (shared mutable state in concurrent code), and the workaround patterns (AtomicReference, single-element array)."),
      (4, "lambda-vs-anon-class",       "Lambda vs Anonymous Inner Class — The Key Differences",            "this binding (lambda = enclosing, anon class = new object), new class file vs invokedynamic, and when you still need an anonymous class (state, multiple methods)."),
      (5, "method-references-forms",    "Method References — Four Forms and One Mental Model",               "Static (Type::staticMethod), unbound instance (Type::instanceMethod), bound instance (obj::instanceMethod), constructor (Type::new) — with examples of when each applies."),
      (6, "function-predicate-consumer","Functional Interfaces — Function, Predicate, Consumer, Supplier",   "The four root types, their single abstract method signatures, and when each maps to a lambda expression in practice."),
      (7, "bifunction-operators",       "BiFunction, UnaryOperator and the Rest of java.util.function",      "The complete package: BiFunction, BiPredicate, BiConsumer, UnaryOperator, BinaryOperator, ToIntFunction, IntFunction — and when to use each."),
      (8, "function-composition",       "Function Composition — andThen, compose, and, or, negate",          "Function.andThen (f then g) vs Function.compose (g then f), Predicate.and/or/negate, Consumer.andThen, and building readable pipelines."),
      (9, "building-a-pipeline",        "Building a Pipeline — Real-World Functional Composition",           "A worked example: transform, filter, combine, and collect using composed functions and predicates — functional style without streams."),
    ]
  },

  "java-streams-internals": {
    "order": 2, "prerequisites": ["java-lambdas-functional"], "next": "java-collectors",
    "lessons": [
      (1,  "stream-mental-model",    "The Stream Mental Model — Source, Intermediate, Terminal",            "A stream is a declarative pipeline over a data source. The three stages, why streams are not data structures, and the one-shot constraint."),
      (2,  "lazy-evaluation",        "Lazy Evaluation — Nothing Executes Until the Terminal Operation",      "Proof: add a peek() and show it doesn't fire until collect(). The lazy pipeline graph, short-circuit operations (findFirst, anyMatch), and their O(1) behaviour."),
      (3,  "stream-sources",         "Stream Sources — Collection, Arrays, Stream.of, iterate, generate",   "Collection.stream() vs parallelStream(), Arrays.stream(), Stream.of(), Stream.iterate() (seeded and unary), Stream.generate() for infinite streams."),
      (4,  "intermediate-operations","Intermediate Operations — filter, map, flatMap, sorted, distinct",     "The stateless (filter, map) vs stateful (sorted, distinct, limit) split, flatMap for nested collections, and peek() as the debugging tool."),
      (5,  "terminal-operations",    "Terminal Operations — collect, reduce, forEach, count, findFirst",     "How terminal operations trigger the pipeline, reduction vs mutable reduction (collect), the identity element contract for reduce(), and short-circuit terminals."),
      (6,  "spliterator",            "The Spliterator — Java's Parallel Iteration Protocol",                "The four characteristics (SIZED, ORDERED, DISTINCT, SORTED), trySplit() for parallel decomposition, and why custom Spliterators unlock parallel custom sources."),
      (7,  "pipeline-execution",     "Stream Pipeline Execution — How the Stages Actually Fuse",            "The sink chain, loop fusion (filter+map becomes one loop), the AbstractPipeline implementation, and why the JVM can optimise the fused pipeline."),
      (8,  "parallel-streams",       "Parallel Streams — ForkJoinPool, Encounter Order and Thread Safety",  "How parallel() switches to ForkJoinPool.commonPool(), encounter order vs processing order, thread-safety of the accumulator, and non-associative reduce bugs."),
      (9,  "when-parallel-hurts",    "When Parallel Hurts — Overhead, Ordering Cost and the Wrong Workload","The fork/join overhead threshold, ordered intermediate ops (sorted) killing parallelism, I/O-bound work saturating the common pool, and JMH benchmarks."),
      (10, "primitive-streams",      "IntStream, LongStream, DoubleStream — Avoiding Autoboxing in Streams", "Primitive stream variants, mapToInt/mapToLong/mapToDouble, sum/average/min/max for free, boxed() to go back, and the performance difference with JMH proof."),
    ]
  },

  "java-collectors": {
    "order": 3, "prerequisites": ["java-streams-internals"], "next": None,
    "lessons": [
      (1, "what-is-collector",        "What Is a Collector? — Supplier, Accumulator, Combiner, Finisher",    "The four components of the Collector<T,A,R> interface, how they map to the parallel reduction, and implementing a trivial collector from scratch."),
      (2, "basic-collectors",         "toList, toSet, toUnmodifiableList, toMap — The Basics and Gotchas",   "toList() (Java 16 unmodifiable), toSet() (undefined order), toMap() (duplicate key exception by default), and the preserving-order trap with toSet."),
      (3, "groupingby",               "groupingBy — Partitioning a Stream by a Classifier",                  "Collectors.groupingBy(classifier), the resulting Map<K, List<T>>, changing the downstream collector, and multi-level grouping with nested groupingBy."),
      (4, "partitioningby",           "partitioningBy — Splitting into Two Groups",                           "Collectors.partitioningBy(predicate), the Map<Boolean, List<T>> result, downstream collectors (counting, joining), and when it's clearer than groupingBy."),
      (5, "downstream-collectors",    "Downstream Collectors — counting, summingInt, mapping, joining",       "All the downstream-compatible collectors: counting(), summingInt/Long/Double, averagingInt, summarizingInt, mapping(), and joining(delimiter, prefix, suffix)."),
      (6, "tomap-collisions",         "Collectors.toMap — Key Collisions and the Merge Function",             "The duplicate-key IllegalStateException, the merge function as the third argument (last-wins, accumulate), and the map factory for LinkedHashMap ordering."),
      (7, "custom-collector",         "Custom Collector Implementation — Building One from Scratch",           "Implementing Collector<String, StringBuilder, String> to join with a prefix/suffix, thread-combining in parallel mode, and the IDENTITY_FINISH characteristic shortcut."),
      (8, "collector-characteristics","Collector Characteristics — CONCURRENT, UNORDERED, IDENTITY_FINISH",  "How characteristics affect parallel execution, what CONCURRENT means (single shared container), UNORDERED for performance, and IDENTITY_FINISH to skip the finisher cast."),
    ]
  },

  "modern-java-features": {
    "order": 4, "prerequisites": ["java-generics"], "next": None,
    "lessons": [
      (1, "text-blocks",             "Text Blocks (Java 13) — Multiline Strings Without Escape Chaos",       "The three-quote delimiter, the re-indentation algorithm (incidental vs essential whitespace), trailing whitespace stripping, and \\<line-continuation>."),
      (2, "records-basics",          "Records (Java 16) — Immutable Data Classes Without the Boilerplate",  "The record declaration, what the compiler auto-generates (canonical constructor, accessors, equals, hashCode, toString), and the final class constraint."),
      (3, "record-internals",        "Record Internals — The Generated Canonical Constructor and Accessors",  "The accessor naming convention (no 'get' prefix), the canonical constructor's parameter matching, and how records appear in bytecode."),
      (4, "compact-constructors",    "Compact Constructors — Validation Without Boilerplate",                "The compact constructor syntax (no parameter list), that it augments not replaces the canonical constructor, and adding validation/normalisation."),
      (5, "sealed-classes",          "Sealed Classes (Java 17) — Restricting the Class Hierarchy",           "The permits clause, same-package/module constraint on permitted classes, how sealed enables exhaustive switch, and sealed interfaces."),
      (6, "sealed-plus-records",     "Sealed Classes + Records — Algebraic Data Types in Java",              "Building Result<T> (Ok<T> | Err) and Shape (Circle | Rectangle | Triangle) with sealed+record combos, and pattern matching over them."),
      (7, "instanceof-pattern",      "instanceof Pattern Matching (Java 16) — Eliminating the Cast",         "The pattern variable (if (x instanceof String s)), scope of the pattern variable, negation (!(x instanceof String s)), and compound patterns."),
      (8, "switch-expressions",      "Switch Expressions (Java 14) — yield and Arrow Cases",                 "Arrow-case switch (no fall-through), the yield keyword for block-body cases, switch as an expression returning a value, and exhaustiveness."),
      (9, "switch-pattern-matching",  "Switch with Pattern Matching (Java 21) — Guarded Patterns",           "Type patterns in switch, guarded patterns (when clause), null handling in switch, ordering of patterns, and why sealed classes make switch exhaustive."),
    ]
  },

  "java-virtual-threads": {
    "order": 5, "prerequisites": ["java-executor-framework"], "next": None,
    "lessons": [
      (1, "thread-per-request-failure","The Thread-Per-Request Model — Why It Broke Down",                   "OS thread stack size (~1MB), the C10K problem, thread-pool exhaustion under I/O latency, and why adding threads doesn't help past a point."),
      (2, "os-vs-virtual-threads",    "OS Threads vs Virtual Threads — The Mount/Unmount Cycle",             "Carrier threads (platform threads), how a virtual thread mounts/unmounts on a carrier when it blocks, and the JVM scheduler that manages this."),
      (3, "creating-virtual-threads", "Thread.ofVirtual() — Creating and Running Virtual Threads",           "Thread.ofVirtual().start(runnable), Thread.ofVirtual().name(prefix, start).unstarted(), Executors.newVirtualThreadPerTaskExecutor(), and throughput demo."),
      (4, "pinning",                  "Pinning — The synchronized Block Problem and the ReentrantLock Fix",  "What pinning means (virtual thread stuck to carrier), the two pinning causes (synchronized + native frames), detecting with -Djdk.tracePinnedThreads, and ReentrantLock as the fix."),
      (5, "threadlocal-at-scale",     "ThreadLocal at Scale — Memory Implications of Millions of Threads",   "Each virtual thread has its own ThreadLocal map, memory overhead at 1M threads, ScopedValue as the emerging replacement, and cleaning up via try-finally."),
      (6, "structured-concurrency",   "Structured Concurrency — StructuredTaskScope and Lifetime Guarantees","ShutdownOnFailure (cancel siblings on first failure), ShutdownOnSuccess (cancel on first success), the structured lifetime (child never outlives parent)."),
      (7, "scoped-value",             "ScopedValue — A Better ThreadLocal for the Virtual Thread World",      "Immutable per-scope bindings, ScopedValue.where().run(), inheritance into child scopes, and why it solves the ThreadLocal memory problem at scale."),
      (8, "reactive-vs-virtual",      "Virtual Threads vs Reactive — When to Choose What in 2025",           "Reactive: explicit backpressure, operator composition, high fanout. Virtual threads: synchronous code, debuggable stack traces, no library support needed. Decision framework."),
    ]
  },

  # ── JAVA CONCURRENCY ──────────────────────────────────────────────────────

  "java-threads-fundamentals": {
    "order": 1, "prerequisites": ["java-oop-internals"], "next": "java-memory-model-concurrency",
    "lessons": [
      (1, "processes-vs-threads",    "Processes vs Threads — The OS-Level Distinction",                     "Address space, file descriptors, page tables — what a process owns. Threads: shared address space, own stack and PC. Context switch cost comparison."),
      (2, "creating-threads",        "Creating Threads — Runnable, Thread and Why to Use Neither Directly",  "Thread(Runnable), Runnable vs Callable, Thread.start() vs run(), why raw Thread creation is wrong (use Executor), and thread naming."),
      (3, "thread-lifecycle",        "Thread Lifecycle — The Six States and Their Transitions",              "NEW, RUNNABLE, BLOCKED, WAITING, TIMED_WAITING, TERMINATED. The exact transitions, how to observe state via thread dumps, and common stuck states."),
      (4, "sleep-wait-park",         "Thread.sleep(), Object.wait() and LockSupport.park() — The Differences","sleep: no lock release, timed. wait: releases monitor, must be in synchronized. park: blocker-based, no spurious-wakeup guarantee. When to use each."),
      (5, "daemon-vs-user",          "Daemon vs User Threads — JVM Shutdown Semantics",                     "JVM exits when all user threads finish (daemon threads are abandoned), setDaemon() must be called before start(), and the use case for daemon threads."),
      (6, "thread-interruption",     "Thread Interruption — The Cooperative Cancellation Protocol",          "interrupt() sets the flag, interrupted() checks-and-clears it, isInterrupted() checks without clearing, and how to propagate interruption correctly."),
      (7, "thread-priority",         "Thread Priority and Scheduling — What the OS Actually Does",           "Thread.MIN_PRIORITY to MAX_PRIORITY (1-10), how the OS scheduler maps priorities (spoiler: often ignored), and why priority is not a reliable synchronisation tool."),
      (8, "reading-thread-dumps",    "Thread Dumps — Reading jstack Output to Diagnose Production Problems", "jstack/jcmd Thread.print, reading state/lock info, identifying deadlocks (jstack reports them), waiting threads, and the 'parking to wait for' pattern."),
    ]
  },

  "java-memory-model-concurrency": {
    "order": 2, "prerequisites": ["java-threads-fundamentals"], "next": "java-synchronization-primitives",
    "lessons": [
      (1,  "cpu-caches-registers",       "CPUs, Caches and Registers — Why Shared Memory Is Complicated",    "L1/L2/L3 cache per core, write buffers, store-load reordering, and why two threads can see different values for the same variable."),
      (2,  "memory-reordering",          "Memory Reordering — Compiler and CPU Reorder Differently",         "Compiler reordering (safe-looking for single thread), CPU out-of-order execution, store-load reordering as the most common case, and why the problem is invisible in tests."),
      (3,  "memory-barriers",            "Memory Barriers — The Hardware Instruction That Prevents Reordering","LoadLoad, StoreStore, LoadStore, StoreLoad barriers, how volatile maps to barriers on x86 vs ARM, and why x86 is a 'strong' memory model."),
      (4,  "jmm-specification",          "The Java Memory Model — What JMM Actually Specifies (JSR-133)",    "The JMM as a formal contract between programmer and JVM, actions and happens-before as the vocabulary, and why the JMM replaced the broken pre-Java-5 model."),
      (5,  "happens-before-program",     "happens-before — The Program Order Rule",                          "Within a single thread, every action happens-before the next in program order. Why this doesn't help across threads, and why reordering is still possible."),
      (6,  "happens-before-monitor",     "happens-before — Monitor Lock and Volatile Variable Rules",         "Monitor unlock happens-before subsequent monitor lock on the same object. Volatile write happens-before subsequent volatile read of the same variable. Implications."),
      (7,  "happens-before-thread",      "happens-before — Thread Start, Join and Interrupt Rules",           "Thread.start() happens-before anything in the new thread. Thread termination happens-before Thread.join() returning. The interrupt rules."),
      (8,  "double-checked-locking-bug", "The Double-Checked Locking Bug — A Missing Volatile Barrier",      "The pre-Java-5 broken singleton, why the partial construction read is possible without volatile, the JSR-133 fix, and why volatile on the field is the correct solution."),
      (9,  "safe-publication",           "Safe Publication — How to Share Objects Across Threads Correctly",  "The four safe publication idioms: static initialisers, volatile fields, final fields (after constructor), and synchronised getter. What unsafe publication looks like."),
      (10, "final-field-semantics",      "Final Field Semantics — The One Free Publication Mechanism",        "The JMM freeze action for final fields: after the constructor completes, all threads see the correct value without any explicit synchronisation."),
    ]
  },

  "java-synchronization-primitives": {
    "order": 3, "prerequisites": ["java-memory-model-concurrency"], "next": "java-explicit-locks",
    "lessons": [
      (1, "monitor-model",             "The Monitor Model — What synchronized Actually Means",               "A monitor = mutual exclusion + condition variable. Every Java object has one. Entry set (waiting for lock) vs wait set (waiting for condition)."),
      (2, "synchronized-method-block", "synchronized Method vs synchronized Block — The Difference",         "Method-level (locks on this or Class), block-level (explicit lock object), and why block-level is usually preferred (narrower critical section, better lock object choice)."),
      (3, "static-synchronized",       "Static synchronized — Locking on the Class Object",                  "Static synchronized locks on the Class object, not on any instance, so static and instance synchronized methods do NOT exclude each other."),
      (4, "lock-inflation",            "Intrinsic Lock Inflation — Biased, Thin and Fat Locks",              "Biased locking (most accesses are single-threaded), thin lock (CAS, no OS involvement), fat lock (OS mutex, blocking). The inflation path and performance implications."),
      (5, "volatile-guarantee",        "volatile — Visibility Guarantee and the No-Atomicity Trap",           "volatile ensures every read sees the latest write. It does NOT make compound operations (i++) atomic. The long/double tearing rule on 32-bit JVMs."),
      (6, "wait-notify",               "Object.wait() and Object.notify() — The Low-Level Coordination Primitive","wait() releases the monitor and blocks, notify() wakes one waiter, notifyAll() wakes all. The must-be-in-synchronized rule and what happens if you violate it."),
      (7, "spurious-wakeup",           "The Spurious Wakeup — Why You Always Use while, Not if",             "POSIX allows spurious wakeups, Java inherits this, so always re-check the condition after wait() returns. The canonical while-loop pattern with proof."),
      (8, "deadlock-via-synchronized", "Deadlock via synchronized — Conditions and the Lock-Ordering Fix",    "The four Coffman conditions, a minimal two-lock deadlock example, lock-ordering as the canonical prevention, and detecting deadlock in jstack output."),
    ]
  },

  "java-explicit-locks": {
    "order": 4, "prerequisites": ["java-synchronization-primitives"], "next": "java-atomic-lockfree",
    "lessons": [
      (1, "why-reentrantlock",     "Why ReentrantLock When We Have synchronized?",                          "The three things synchronized cannot do: timed lock attempt, interruptible lock wait, and fair queuing. ReentrantLock provides all three."),
      (2, "reentrantlock-api",     "ReentrantLock — tryLock, lockInterruptibly, Fair vs Unfair",            "lock(), tryLock() with and without timeout, lockInterruptibly(), getHoldCount(), fair mode (FIFO queue) vs unfair (barge-in for throughput)."),
      (3, "try-finally-unlock",    "ReentrantLock Must Be in try-finally — The Unlock Guarantee",           "If the critical section throws, the lock must still be released or the program deadlocks. The canonical try { lock(); ... } finally { unlock(); } pattern."),
      (4, "condition",             "Condition — The Superior wait/notify with Explicit Locks",               "lock.newCondition(), await() and signal()/signalAll(), multiple conditions per lock (full vs empty in a bounded buffer), and the spurious wakeup while-loop."),
      (5, "readwritelock",         "ReadWriteLock — Read-Write Separation for Low-Write Workloads",         "Multiple concurrent readers OR one exclusive writer. ReentrantReadWriteLock, readLock() and writeLock(), and the read-heavy cache invalidation use case."),
      (6, "writer-starvation",     "ReadWriteLock: Writer Starvation and Mitigation",                       "If readers continuously arrive, writers never get the lock (starvation). Fair mode mitigates this. Alternatively, StampedLock's tryOptimisticRead()."),
      (7, "stampedlock",           "StampedLock — Optimistic Reads and the Validate Pattern",               "The three modes (read, write, optimistic read), tryOptimisticRead() returns a stamp, validate(stamp) checks if a write occurred, and converting stamps."),
      (8, "deadlock-explicit",     "Deadlock with Explicit Locks — Detection and Prevention",                "Explicit locks have the same deadlock risk as synchronized. Lock ordering, tryLock with timeout as a deadlock-avoidance strategy, and lock hierarchy."),
    ]
  },

  "java-atomic-lockfree": {
    "order": 5, "prerequisites": ["java-synchronization-primitives"], "next": "java-concurrent-collections",
    "lessons": [
      (1,  "cas-hardware",            "The Hardware Instruction — Compare-and-Swap at the CPU Level",       "CMPXCHG on x86, LDREX/STREX on ARM, what compare-and-swap atomically does, and why it's the foundation for lock-free programming."),
      (2,  "atomicinteger-long",      "AtomicInteger and AtomicLong — The Java CAS Wrappers",               "getAndIncrement(), incrementAndGet(), addAndGet(), compareAndSet() — mapping each to the underlying CAS loop, and reading the JDK source."),
      (3,  "atomicreference",         "AtomicReference — CAS for Object References",                        "AtomicReference<V>, compareAndSet(expected, update), getAndSet(), and the lock-free linked-list node update pattern."),
      (4,  "cas-loop-pattern",        "The compareAndSet() Loop Pattern — Lock-Free Counter from Scratch",   "The do { old = get(); next = f(old); } while (!cas(old, next)); pattern, proof of linearisability, and ABA as the lurking danger."),
      (5,  "aba-problem",             "The ABA Problem — Why CAS Is Not Always Enough",                     "Thread reads A, another thread changes A→B→A, first thread's CAS succeeds on a corrupt state. Lock-free stack pop as the canonical example."),
      (6,  "atomicstampedreference",  "AtomicStampedReference and AtomicMarkableReference — ABA Countermeasures","Pairing a version stamp with the reference so CAS checks both, AtomicMarkableReference for single-bit flags, and the performance cost."),
      (7,  "longadder",               "LongAdder and LongAccumulator — Striped Cells Under Contention",     "The Striped64 base class, per-CPU cell array for contention reduction, final sum() combining cells, and JMH showing LongAdder beating AtomicLong under contention."),
      (8,  "varhandle",               "VarHandle (Java 9) — The Unsafe Replacement",                        "VarHandle for field-level and array-element CAS, access modes (plain, opaque, acquire/release, volatile), and why VarHandle is safer than sun.misc.Unsafe."),
      (9,  "lockfree-stack",          "Lock-Free Stack — A Real Implementation with CAS",                   "Treiber Stack: push with CAS on top, pop with CAS on top, the ABA problem in pop, and using AtomicStampedReference to fix it."),
      (10, "lockfree-queue",          "Lock-Free Queue — The Michael-Scott Queue Explained",                 "The Michael-Scott two-pointer (head/tail) algorithm, CAS on tail for enqueue, CAS on head for dequeue, and why it tolerates partial operations."),
    ]
  },

  "java-executor-framework": {
    "order": 6, "prerequisites": ["java-threads-fundamentals"], "next": "java-completable-future",
    "lessons": [
      (1, "executor-abstraction",    "The Executor Abstraction — Decoupling Task Submission from Execution", "The Executor, ExecutorService, and ScheduledExecutorService interfaces, why they separate what to run from how/when, and the command pattern connection."),
      (2, "threadpoolexecutor-params","ThreadPoolExecutor — corePoolSize, maximumPoolSize and keepAliveTime", "The five constructor parameters, the core/max/keepAlive interaction, allowCoreThreadTimeOut(), and why you should always build ThreadPoolExecutor explicitly."),
      (3, "queue-types",             "The Queue — SynchronousQueue vs LinkedBlockingQueue vs ArrayBlockingQueue","SynchronousQueue (no storage, handoff only), LinkedBlockingQueue (unbounded by default — OOM risk), ArrayBlockingQueue (bounded — apply backpressure)."),
      (4, "thread-creation-policy",  "The Thread Creation Policy — When Are New Threads Created?",           "Threads are added up to core first, then queue fills, then threads added to max. The counterintuitive order surprises everyone. Diagram and code proof."),
      (5, "rejection-policies",      "RejectedExecutionHandler — All Four Policies Explained",               "AbortPolicy (throws RejectedExecutionException), CallerRunsPolicy (run in submitter), DiscardPolicy (silently drop), DiscardOldestPolicy (drop oldest queued)."),
      (6, "executors-factory",       "Executors Factory Methods — What's Hidden Behind the Convenience",     "newFixedThreadPool (unbounded LinkedBlockingQueue), newCachedThreadPool (unbounded threads — OOM risk), newSingleThreadExecutor, newScheduledThreadPool internals."),
      (7, "callable-future",         "Callable and Future — Submitting Tasks That Return Results",            "submit(Callable) returns Future<T>, get() blocks (with or without timeout), cancel(), isDone(), and the ExecutionException wrapping checked exceptions."),
      (8, "safe-shutdown",           "Shutting Down Safely — shutdown(), shutdownNow() and awaitTermination()","shutdown() stops accepting new tasks (drains queue), shutdownNow() interrupts running tasks, awaitTermination() blocks until done, and the correct shutdown sequence."),
    ]
  },

  "java-completable-future": {
    "order": 7, "prerequisites": ["java-executor-framework"], "next": "java-virtual-threads",
    "lessons": [
      (1, "problem-with-future",    "The Problem with Future — Blocking and No Composition",                "Future.get() blocks the calling thread, cannot chain computations without blocking, and has no callback mechanism — all the pain that led to CompletableFuture."),
      (2, "supplyasync-runasync",   "supplyAsync and runAsync — Starting an Async Computation",             "supplyAsync(Supplier, executor) for a result-producing task, runAsync(Runnable, executor) for side-effect tasks, and why always passing an executor is best practice."),
      (3, "thenapply-thencompose",  "thenApply and thenCompose — map vs flatMap for Futures",               "thenApply transforms the result synchronously (map), thenCompose unwraps a nested CompletableFuture (flatMap). The nested future anti-pattern."),
      (4, "thencombine",            "thenCombine — Joining Two Independent Futures",                         "thenCombine(other, BiFunction) waits for both futures and combines their results, running them concurrently. thenAcceptBoth and runAfterBoth variants."),
      (5, "allof-anyof",            "allOf and anyOf — Waiting for Multiple Futures",                        "allOf returns Void (requires .thenApply to collect results), anyOf returns the first to complete, and the pattern for collecting all results after allOf."),
      (6, "exceptionally-handle",   "exceptionally and handle — Error Recovery in the Pipeline",             "exceptionally(fn) only fires on exception, handle(BiFunction) always fires (result or exception), and whenComplete for side effects without recovery."),
      (7, "whencomplete",           "whenComplete — Side Effects Regardless of Success or Failure",           "whenComplete vs handle: whenComplete cannot transform the result, useful for logging/metrics on both success and failure paths."),
      (8, "custom-executor-io",     "Avoiding the commonPool — Custom Executors for I/O-Bound Tasks",        "ForkJoinPool.commonPool() has (CPU-1) threads — I/O tasks block them. Always pass a boundedElastic Executor for database/network calls."),
    ]
  },

  "java-concurrent-collections": {
    "order": 8, "prerequisites": ["java-atomic-lockfree", "collections-maps"], "next": None,
    "lessons": [
      (1, "why-not-synchronized",       "Why java.util Collections Are Not Thread-Safe",                    "ArrayList, HashMap etc. are not designed for concurrent access. Races, data corruption, and the infinite loop bug in Java 7 HashMap as concrete examples."),
      (2, "concurrenthashmap-java7",    "ConcurrentHashMap: Java 7 Segment Locking",                        "16 segments each with a ReentrantLock, concurrent reads without lock, writes lock only the relevant segment — 16x concurrency over Hashtable."),
      (3, "concurrenthashmap-java8",    "ConcurrentHashMap: Java 8 Node-Level CAS + synchronized",          "Empty bucket: CAS to insert first node. Non-empty bucket: synchronized on head node. No segments. Forward nodes during resize. Concurrent size tracking."),
      (4, "concurrenthashmap-atomics",  "ConcurrentHashMap: compute(), merge(), computeIfAbsent() Atomicity","These methods atomically apply a function to a key's value. The entire read-modify-write is atomic per key, unlike separate get+put."),
      (5, "concurrenthashmap-size",     "ConcurrentHashMap: size() Is Approximate — Why and When It Matters", "size() sums per-segment counters (like LongAdder), so it can be slightly stale under concurrent modification. When this matters vs when it doesn't."),
      (6, "concurrenthashmap-null",     "ConcurrentHashMap: No Null Keys or Values — The Reasoning",         "Null would make a get() result ambiguous (key absent vs mapped to null). This is deliberate, unlike HashMap. ConcurrentHashMap.get(k)==null means absent."),
      (7, "copyonwritearraylist-detail", "CopyOnWriteArrayList — Write Cost, Snapshot Iterators and When to Use It","Full volatile array copy on every mutation, iterator operates on a snapshot so it never throws CME, and the listener-list / observer use case."),
      (8, "concurrent-lockfree",        "ConcurrentLinkedQueue and ConcurrentSkipListMap — Lock-Free Structures","ConcurrentLinkedQueue's Michael-Scott algorithm, ConcurrentSkipListMap as a sorted concurrent map alternative to synchronised TreeMap."),
    ]
  },

  "java-synchronizers": {
    "order": 9, "prerequisites": ["java-explicit-locks"], "next": None,
    "lessons": [
      (1, "countdownlatch",          "CountDownLatch — One-Shot Coordination for N Events",                 "CountDownLatch(n), countDown() decrements, await() blocks until zero. Single-use (cannot reset). Canonical use: wait for N threads to finish setup."),
      (2, "cyclicbarrier",           "CyclicBarrier — Reusable Rendezvous for N Threads",                   "CyclicBarrier(n, barrierAction), await() blocks until all n threads arrive, runs optional action, then all release. Can be reset for the next phase."),
      (3, "semaphore",               "Semaphore — Counting Resource Gates",                                  "Semaphore(n), acquire() claims a permit (blocks if none), release() returns it. Canonical use: limit concurrent database connections or thread count."),
      (4, "exchanger",               "Exchanger — Pair-Wise Data Handoff Between Two Threads",              "Exchanger<V>.exchange(v) — each of two threads gives a value and receives the other's. Useful for pipeline stages that need to swap buffers."),
      (5, "phaser",                  "Phaser — Flexible Multi-Phase Coordination",                           "Phaser with dynamic party registration (register/deregister), arriveAndAwaitAdvance() for phase barriers, arriveAndDeregister() to leave, and tiered Phasers."),
      (6, "producer-consumer-bq",    "Producer-Consumer with BlockingQueue — The Pattern You'll Use Most",   "ArrayBlockingQueue/LinkedBlockingQueue as the channel, put() blocks when full, take() blocks when empty. The while(true)+poison-pill shutdown pattern."),
      (7, "classic-problems",        "Classic Problems — Dining Philosophers and Readers-Writers",           "Dining Philosophers with lock ordering (assign IDs, always acquire lower first) and with Semaphore. Readers-Writers with ReadWriteLock and the starvation issue."),
    ]
  },

  "java-fork-join": {
    "order": 10, "prerequisites": ["java-executor-framework"], "next": None,
    "lessons": [
      (1, "divide-conquer-model",   "Divide-and-Conquer and the Fork/Join Mental Model",                   "The problem shape: recursively split work, solve base cases, join results. Why this pattern is inherently parallel and why a regular ThreadPoolExecutor is wrong for it."),
      (2, "forkjoinpool",           "ForkJoinPool — Work-Stealing Deques and the Thread Count",             "Each worker thread has a deque. Push own tasks to the front. Steal from the back of other threads' deques. Default parallelism = available processors."),
      (3, "recursivetask",          "RecursiveTask — Splitting Work and Joining Results",                    "Extending RecursiveTask<Long>, compute() splits the range, fork() submits subtasks asynchronously, join() collects results. Fibonacci and sum examples."),
      (4, "recursiveaction",        "RecursiveAction — Fire-and-Forget Parallel Computation",               "Extending RecursiveAction for void work (e.g. parallel sort-in-place), compute() forks/invokes subtasks, and when to use invokeAll() vs fork()+join()."),
      (5, "commonpool-dangers",     "ForkJoinPool.commonPool — What It Is and When Not to Use It",          "parallel streams and CompletableFuture.supplyAsync() use the commonPool by default. Blocking tasks (I/O) starve the pool for CPU tasks. Always use a custom pool for I/O."),
      (6, "parallel-streams-fj",   "Parallel Streams and Fork/Join — The Hidden Connection",               "Stream.parallel() splits via the source Spliterator, submits subtasks to ForkJoinPool.commonPool(), and joins results. Why the Spliterator's trySplit() matters."),
    ]
  },

  # ── DESIGN PATTERNS ───────────────────────────────────────────────────────

  "solid-principles": {
    "order": 1, "prerequisites": ["java-oop-internals"], "next": "creational-patterns",
    "lessons": [
      (1, "why-principles",         "Why Principles? — What Makes Code Hard to Change",                     "The cost of change as the measure of design quality, coupling vs cohesion, and why principles are heuristics not laws."),
      (2, "single-responsibility",  "Single Responsibility — One Reason to Change (Not One Method)",         "SRP is about actors: who can demand this code changes? A class serving two actors violates SRP. The Employee class with three actor example."),
      (3, "open-closed",            "Open/Closed — Extending Without Modifying",                             "Adding features by adding new code (classes, lambdas) not editing existing. Strategy pattern as the mechanism. Plugin architecture as the extreme."),
      (4, "liskov-substitution",    "Liskov Substitution — Behavioural Subtyping and the Square-Rectangle",  "LSP: you must be able to use any subtype wherever the supertype is expected without knowing. Square extends Rectangle breaks this — the proof and the fix."),
      (5, "interface-segregation",  "Interface Segregation — Fat Interfaces and Their Victims",               "Clients should not depend on methods they don't use. Splitting a fat interface (IWorker) into IWorkable + IFeedable. The cohesion connection."),
      (6, "dependency-inversion",   "Dependency Inversion — Depending on Abstractions, Not Concretions",     "High-level modules and low-level modules both depend on abstractions (interfaces). DIP inverts the dependency arrow. Spring DI as the canonical implementation."),
      (7, "solid-in-spring",        "SOLID in Spring — How the Framework Embodies All Five Principles",      "SRP (one bean per responsibility), OCP (@ConditionalOnMissingBean), LSP (bean substitution), ISP (narrow interfaces), DIP (the entire IoC container)."),
      (8, "refactoring-to-solid",   "Refactoring to SOLID — A Before/After Case Study",                      "Take a realistic 150-line God class and systematically extract responsibilities, inject dependencies, and introduce interfaces — with before/after diffs."),
    ]
  },

  "creational-patterns": {
    "order": 2, "prerequisites": ["solid-principles"], "next": "structural-patterns",
    "lessons": [
      (1, "why-creational",         "Why Creational Patterns? — The Problem of Object Construction",         "Construction logic scattered across the codebase, tight coupling to concrete types, no control over lifecycle — the pain that makes creational patterns inevitable."),
      (2, "singleton-wrong",        "Singleton — All the Ways to Do It Wrong",                               "Naive (not thread-safe), synchronised getInstance (correct but slow), double-checked locking with missing volatile (broken pre-Java 5), eager initialisation."),
      (3, "singleton-enum",         "Singleton — The Enum Solution (Serialisation-Safe, Reflection-Safe)",   "Enum instances are guaranteed unique by the JVM. No getInstance(), no reflection exploit, no serialisation duplicate. Effective Java Item 3."),
      (4, "factory-method",         "Factory Method — Decoupling Creation from Usage",                       "Define an interface for creating an object, let subclasses decide which class to instantiate. The creator/product relationship and the DIP connection."),
      (5, "abstract-factory",       "Abstract Factory — Families of Related Objects",                        "When you need to create families of related objects (UI widgets per OS, DAOs per database) without specifying concrete classes. AbstractFactory + ConcreteFactory."),
      (6, "builder",                "Builder — Telescoping Constructors and Fluent APIs",                    "The telescoping constructor smell (10 optional params), Effective Java's static inner Builder, step builders for ordered construction, and Lombok @Builder caveats."),
      (7, "prototype",              "Prototype — Clone vs Copy Constructor and Deep Copy",                    "Cloneable and clone() (broken — shallow, checked exception), the copy constructor alternative, deep copy via serialisation, and the prototype registry."),
      (8, "object-pool",            "Object Pool — Reusing Expensive Objects",                               "When to pool (expensive construction: DB connections, SSL contexts, parsers), the pool interface (borrow/return), validation, eviction, and HikariCP as a real example."),
    ]
  },

  "structural-patterns": {
    "order": 3, "prerequisites": ["creational-patterns"], "next": "behavioral-patterns",
    "lessons": [
      (1, "what-is-structural",     "What Makes a Pattern Structural?",                                      "Structural patterns compose classes and objects to form larger structures. The composition-over-inheritance theme running through all of them."),
      (2, "proxy-static",           "Proxy — Static Proxy: The Manual Way",                                  "Hand-written proxy implements the same interface, delegates to the real object, adds a cross-cutting concern (logging, access control). The boilerplate cost."),
      (3, "proxy-jdk-dynamic",      "Proxy — JDK Dynamic Proxy and the Interface Requirement",               "Proxy.newProxyInstance(), InvocationHandler, how the JVM generates the proxy class at runtime, and why it requires an interface (no concrete class support)."),
      (4, "proxy-cglib",            "Proxy — CGLIB for Concrete Classes and Spring AOP Selection",           "CGLIB generates a subclass at runtime, overriding every method. Spring uses JDK proxy when interface exists, CGLIB otherwise. final methods cannot be proxied."),
      (5, "proxy-self-invocation",  "Proxy — The Self-Invocation Trap That Bypasses AOP",                   "When a method calls another method on the same object (this.method()), it bypasses the proxy — no @Transactional, no @Cacheable. The fix options."),
      (6, "decorator",              "Decorator — Wrapping Behaviour Without Subclassing",                    "Wrap an object with the same interface, adding behaviour before/after delegation. Composable decorators. Decorator vs Proxy: augmentation vs control."),
      (7, "decorator-io-streams",   "Decorator — Java I/O Streams as the Canonical Example",                 "BufferedInputStream wraps FileInputStream wraps Socket. Each adds one layer. Building the stack manually, and why the composition is both powerful and confusing."),
      (8, "adapter-facade",         "Adapter and Facade — Bridging and Simplifying",                         "Adapter: convert one interface to another (class adapter vs object adapter). Facade: simplify a complex subsystem behind a single unified interface."),
      (9, "composite",              "Composite — Recursive Tree Structures",                                  "Component interface, Leaf implements it, Composite holds children and implements it by delegating to children. File system, UI component tree, expression tree."),
    ]
  },

  "behavioral-patterns": {
    "order": 4, "prerequisites": ["structural-patterns"], "next": "clean-architecture",
    "lessons": [
      (1,  "strategy",              "Strategy — Injecting Behaviour Instead of Subclassing",                 "Replace subclass explosion (SortBySomething, FilterBySomething) with injected Strategy objects. Open/Closed in action. Comparator as the built-in Java Strategy."),
      (2,  "strategy-lambdas",      "Strategy — Lambda Strategies in Java 8+",                               "Functional interfaces as strategies. Passing a lambda where a strategy object was expected. The cognitive shift from OO to functional strategy injection."),
      (3,  "observer",              "Observer — Push vs Pull, Event Systems and Memory Leaks",               "Subject notifies Observers on state change. Push (subject sends data) vs pull (observer queries). java.util.Observable (deprecated) and PropertyChangeListener."),
      (4,  "observer-memory-leak",  "Observer — The Memory Leak Trap and Weak Reference Fix",                "Registered but never deregistered listeners prevent GC of the observer object. The classic Android/Swing leak. WeakReference listeners and event bus patterns."),
      (5,  "command",               "Command — Encapsulating Operations for Undo/Redo",                      "Encapsulate a request as an object with execute() and undo(). Command history stack for undo. Macro commands (CompositeCommand). Queuing and logging."),
      (6,  "template-method",       "Template Method — The Hollywood Principle",                             "Define the skeleton of an algorithm in a base class, let subclasses fill in the steps. The Hollywood Principle: don't call us, we'll call you. AbstractList."),
      (7,  "chain-of-responsibility","Chain of Responsibility — Servlet Filters and Spring Interceptors",    "Pass a request along a chain of handlers until one handles it. Servlet Filter chain, Spring HandlerInterceptor, and building your own pipeline."),
      (8,  "state",                 "State — Replacing Conditional Logic with Polymorphism",                  "Replace a large if/switch on state with a state object per state, each implementing the same interface. Traffic light, vending machine, TCP connection state."),
      (9,  "visitor",               "Visitor — Double Dispatch and Adding Operations Without Subclassing",    "Add operations to an object hierarchy without modifying the classes. Double dispatch: accept(Visitor v) calls v.visit(this). AST evaluation as the canonical example."),
      (10, "anti-patterns",         "Anti-Patterns — God Object, Anemic Domain Model, Primitive Obsession",  "God Class (does everything), Anemic Domain Model (data bags with no behaviour), Primitive Obsession (String for email, int for money), Service Locator."),
    ]
  },

  "clean-architecture": {
    "order": 5, "prerequisites": ["behavioral-patterns"], "next": None,
    "lessons": [
      (1, "why-architecture",       "Why Architecture? The Cost of Wrong Dependencies",                      "When the UI depends on the DB, changing the DB breaks the UI. Wrong dependency directions make change expensive. Architecture is about managing dependencies."),
      (2, "layered-architecture",   "Layered Architecture — Presentation, Application, Domain, Infrastructure","The four layers, each depending only on the layer below. What belongs in each, and the rule: domain knows nothing about infrastructure."),
      (3, "dependency-rule",        "The Dependency Rule — Dependencies Must Point Inward",                   "Source code dependencies must point toward higher-level policy. The direction of dependency is the architectural decision. Plugins depend on the core."),
      (4, "ports-and-adapters",     "Ports and Adapters (Hexagonal) — Driving vs Driven Adapters",           "The application core has ports (interfaces). Driving adapters (REST controllers, CLI) call in. Driven adapters (DB, email) are called out through ports."),
      (5, "domain-model",           "The Domain Model — Entities, Value Objects and Aggregates",             "Entity (identity-based equality), Value Object (structural equality, immutable), Aggregate (consistency boundary, one root). Keeping business logic in the domain."),
      (6, "application-services",   "Application Services — Orchestrating Domain Logic",                     "Use cases live in application services, not controllers or repositories. The service fetches, operates on the domain, persists, and returns a response."),
      (7, "testing-clean-arch",     "Testing in Clean Architecture — What Gets Mocked and What Doesn't",     "Domain is pure Java — no mocks needed. Application services mock driven ports. Adapters tested with integration tests. The testing pyramid maps cleanly."),
      (8, "spring-clean-arch",      "Applying Clean Architecture to a Spring Boot Application",              "Package by component not by layer. @Component as adapter, interface as port, domain is plain Java. A concrete example with Spring Data JPA as the driven adapter."),
    ]
  },

  # ── JAVA (ADVANCED) ───────────────────────────────────────────────────────

  "java-io-streams": {
    "order": 2, "prerequisites": ["java-type-system"], "next": "java-nio",
    "lessons": [
      (1, "io-model",               "The I/O Model — Bytes vs Characters and the Two Hierarchies",          "Why Java has two parallel hierarchies (byte streams and character streams), the encoding problem that forced the split, and when to use each."),
      (2, "inputstream-outputstream","InputStream and OutputStream — Read, Write, Flush and Close",          "The abstract read()/write() contract, the single-byte vs bulk-read distinction, the flush() contract, and why close() must always be called."),
      (3, "buffered-streams",        "BufferedInputStream and BufferedOutputStream — System Call Batching",   "Without buffering every read/write is a syscall. BufferedInputStream's internal byte[] buffer, how read() fills from the buffer, and the 8KB default size."),
      (4, "reader-writer",           "Reader and Writer — Character Encoding and the InputStreamReader Bridge","InputStreamReader wraps InputStream with a Charset, OutputStreamWriter wraps OutputStream. Always specify the charset explicitly — never rely on the default."),
      (5, "buffered-char-io",        "BufferedReader and BufferedWriter — Line-Oriented I/O",                 "readLine() reads until \\n/\\r\\n/\\r, returns null at EOF. BufferedWriter.newLine() writes the OS line separator. The newLine() cross-platform trap."),
      (6, "twr-streams",             "try-with-resources — The Right Way to Close Streams",                   "Every stream must be closed. The pre-TWR nesting nightmare. TWR generates correct finally blocks. Nested TWR closes in reverse order. The double-exception issue."),
      (7, "printstream-printwriter",  "PrintStream and PrintWriter — Formatted Output and the Encoding Trap", "System.out is a PrintStream. println() appends the platform line separator. PrintWriter vs PrintStream encoding. The autoflush option and when it matters."),
    ]
  },

  "java-nio": {
    "order": 3, "prerequisites": ["java-io-streams"], "next": "java-nio2",
    "lessons": [
      (1, "why-nio",                "Why NIO? — The Scalability Problem with Blocking I/O",                 "One thread per connection in blocking I/O. Context switch overhead at 10K connections. The C10K problem and why NIO's single-thread-many-channels model solves it."),
      (2, "bytebuffer-state",       "ByteBuffer — capacity, limit, position, mark and the State Machine",    "The five state variables and their invariants. How read() advances position, how limit moves to constrain. The common off-by-one that comes from forgetting limit."),
      (3, "flip-protocol",          "The Flip Protocol — Writing Then Reading from the Same Buffer",          "Write mode: position advances, limit at capacity. flip(): limit=position, position=0. Read mode. clear() and compact() to prepare for the next write cycle."),
      (4, "filechannel",             "FileChannel — Efficient File I/O with Channels",                        "FileChannel.open(), read/write with ByteBuffer, position(), size(), truncate(), and transferTo()/transferFrom() for zero-copy file-to-socket transfer."),
      (5, "socketchannel-nb",        "SocketChannel in Non-Blocking Mode",                                    "configureBlocking(false), connect() returning false, finishConnect(), and the non-blocking read() returning 0 vs -1 (EOF)."),
      (6, "selector",               "Selector — Multiplexing Many Channels on One Thread",                   "Selector.open(), channel.register(selector, OP_READ|OP_WRITE|OP_ACCEPT), selector.select() blocking, iterating the selectedKeys() set."),
      (7, "reactor-pattern",        "The Reactor Pattern — Event Loop Architecture in Java",                  "The event loop: select, dispatch to handler, handler reads/writes. Implementing a minimal HTTP/1.1 server with NIO Selector. The foundation of Netty."),
      (8, "direct-vs-heap-buffer",  "Direct ByteBuffer vs Heap ByteBuffer — Off-Heap Trade-offs",            "allocate() (JVM heap, GC managed), allocateDirect() (off-heap, OS memory), why OS I/O avoids one copy with direct buffers, and the finaliser-based deallocation risk."),
    ]
  },

  "java-nio2": {
    "order": 4, "prerequisites": ["java-nio"], "next": None,
    "lessons": [
      (1, "path-api",               "The Path API — java.nio.file.Path vs java.io.File",                     "Path is immutable, File is mutable state. Paths.get() and Path.of(), resolve(), relativize(), normalize(), toAbsolutePath(), and the cross-platform separator."),
      (2, "files-utility",          "Files Utility Class — Copy, Move, Walk and Atomic Operations",           "Files.copy(), Files.move() with ATOMIC_MOVE option, Files.walk() for recursive traversal, Files.find() with predicate, and the checked IOException contract."),
      (3, "file-attributes",        "File Attributes — BasicFileAttributes, POSIX Permissions",               "BasicFileAttributes (size, creation/modification time, isDirectory), readAttributes() vs getAttribute(), PosixFilePermissions for Unix permission bits."),
      (4, "watchservice",           "WatchService — File System Events",                                       "WatchService.register() with ENTRY_CREATE/DELETE/MODIFY, the poll/take loop, overflow events, the platform mapping (inotify/kqueue/ReadDirectoryChangesW)."),
      (5, "memory-mapped-files",    "Memory-Mapped Files — MappedByteBuffer and Zero-Copy I/O",               "FileChannel.map() with MapMode.READ_ONLY/READ_WRITE, the mmap syscall, page-fault-based demand loading, and force() to flush to disk. Large file processing."),
      (6, "file-migration-guide",   "java.io.File vs Path — A Migration Guide",                               "File.toPath() as the bridge, common File methods and their Path/Files equivalents, and why new code should never use java.io.File."),
    ]
  },

  "java-reflection-proxies": {
    "order": 5, "prerequisites": ["java-generics"], "next": None,
    "lessons": [
      (1, "reflection-api",         "The Reflection API — Class, Method, Field, Constructor",                 "Class.forName(), getClass(), getDeclaredMethods() vs getMethods(), getDeclaredField(), setAccessible(), invoke() and newInstance() — the full API."),
      (2, "setaccessible",          "setAccessible() — Breaking Encapsulation (and When It's OK)",             "setAccessible(true) bypasses access control, the SecurityManager check (mostly gone in Java 17+), module system restrictions, and the legitimate use cases."),
      (3, "annotation-runtime",     "Annotation Processing — Retention Policies and Reading at Runtime",       "RetentionPolicy.SOURCE/CLASS/RUNTIME, reading annotations at runtime via reflection (getAnnotation, getAnnotationsByType), and building a simple DI scanner."),
      (4, "annotation-apt",         "Annotation Processing at Compile Time — APT and Code Generation",         "AbstractProcessor, @SupportedAnnotationTypes, RoundEnvironment, generating source files with Filer, and how Lombok and MapStruct use APT."),
      (5, "jdk-dynamic-proxy",      "JDK Dynamic Proxy — InvocationHandler and the Interface Requirement",     "Proxy.newProxyInstance(ClassLoader, Class[], InvocationHandler), the generated class, InvocationHandler.invoke(proxy, method, args), and caching the proxy class."),
      (6, "cglib-proxy",            "CGLIB Proxy — Subclass-Based Proxying for Concrete Classes",              "CGLIB generates a subclass at runtime (bytecode engineering), Enhancer.create(), MethodInterceptor, final method limitation, and Spring's selection algorithm."),
      (7, "methodhandle",           "MethodHandle — The Fast, Modern Alternative to Reflection",               "MethodHandles.lookup(), findVirtual/findStatic/findConstructor, invokeExact vs invoke, MethodType, and the JIT-friendliness advantage over reflection."),
      (8, "module-reflection",      "Module System and Reflection — --add-opens and Why Frameworks Need It",   "JPMS restricts reflective access to non-exported packages. --add-opens as the escape hatch. InaccessibleObjectException. Spring, Hibernate, Jackson all need it."),
    ]
  },

  "java-serialization": {
    "order": 6, "prerequisites": ["java-io-streams"], "next": None,
    "lessons": [
      (1, "serializable-contract",  "The Serializable Contract — What You're Actually Committing To",         "Marking a class Serializable is a commitment: the serialised form becomes part of your public API. Every field's type must also be serialisable."),
      (2, "serialversionuid",       "serialVersionUID — The Most Ignored Field in Java",                       "Without it the JVM computes one from the class structure. Any change breaks deserialization. Always declare it explicitly. The InvalidClassException story."),
      (3, "transient-fields",       "transient — Excluding Fields from Serialization",                         "transient fields are zeroed/null on deserialization. Use cases: derived fields, credentials, handles. The responsibility to restore transient state."),
      (4, "custom-serialization",   "readObject() and writeObject() — Custom Serialization Hooks",             "Override readObject to validate invariants after deserialization, writeObject for custom field encoding, and the readResolve/writeReplace substitution hooks."),
      (5, "gadget-chain-attack",    "The Gadget Chain Attack — Why Java Deserialization Is a CVE Factory",     "Deserializing untrusted bytes can execute arbitrary code via gadget chains (Apache Commons Collections etc.). CVE-2015-4852 and the fix: deserialization filters."),
      (6, "readresolve",            "readResolve() — Singleton Integrity During Deserialization",              "Deserialization bypasses constructors, creating a second Singleton instance. readResolve() returns the canonical instance. Enum singletons have this built in."),
      (7, "modern-alternatives",    "Modern Alternatives — Jackson, Protobuf and Avro Compared",               "Schema evolution (backward/forward compatibility), binary size, performance, and tooling. When each is appropriate: Jackson for JSON APIs, Protobuf for RPCs, Avro for event streams."),
    ]
  },

  "jdbc-and-pooling": {
    "order": 7, "prerequisites": ["spring-boot"], "next": "database-transactions",
    "lessons": [
      (1, "jdbc-from-scratch",      "JDBC from Scratch — DriverManager, Connection and the Three Statement Types","DriverManager.getConnection(), Statement vs PreparedStatement vs CallableStatement, ResultSet, and the raw JDBC experience before any framework."),
      (2, "resultset-iteration",    "ResultSet and Data Retrieval — Iteration, Column Access and Type Safety",  "next() returning false at EOF, getString/getInt/getObject, wasNull() for nulls, column index vs column name, and closing ResultSet/Statement/Connection."),
      (3, "prepared-statement",     "PreparedStatement — SQL Injection Prevention and Parameterisation",        "How parameterised queries prevent injection (placeholder sent to DB parser), setString/setInt/setNull, and the DB plan caching benefit."),
      (4, "batch-operations",       "Batch Operations — Sending 10,000 Rows Without 10,000 Round Trips",       "addBatch(), executeBatch(), the network round-trip cost, optimal batch size (1K-5K), and rewriteBatchedStatements for MySQL performance."),
      (5, "why-connection-pooling", "Why Connection Pooling? — The True Cost of Connection Creation",           "TCP handshake, TLS negotiation, database authentication, session setup — creating a connection takes 20-100ms. Pooling amortises this cost."),
      (6, "hikaricp-internals",     "HikariCP Internals — Pool Sizing, Acquisition and Validation",             "The pool sizing formula (Tn * (Cm - 1) + 1), connection acquisition via ConcurrentBag, idle connection validation (keepaliveTime), and the fast path."),
      (7, "hikaricp-configuration", "HikariCP Configuration — Timeouts, Leak Detection and Production Settings","connectionTimeout, idleTimeout, maxLifetime, minimumIdle, leakDetectionThreshold, and the hikari.properties checklist for production."),
    ]
  },

  "database-transactions": {
    "order": 8, "prerequisites": ["jdbc-and-pooling"], "next": "jpa-hibernate",
    "lessons": [
      (1, "acid-properties",        "ACID — Atomicity, Consistency, Isolation, Durability from First Principles","Each property defined precisely: Atomicity (all-or-nothing), Consistency (invariants preserved), Isolation (concurrent = serial), Durability (committed survives crash)."),
      (2, "isolation-levels",       "Isolation Levels — READ UNCOMMITTED through SERIALIZABLE",                 "The four ANSI isolation levels, what each prevents and what anomaly it allows, and the default isolation level in popular databases (REPEATABLE READ in MySQL, READ COMMITTED in Postgres)."),
      (3, "read-anomalies",         "Dirty, Non-Repeatable and Phantom Reads — With Real Examples",             "Dirty read (read uncommitted data that rolls back), non-repeatable read (same query returns different rows), phantom read (new rows appear) — each with a concrete scenario."),
      (4, "locking",                "Locking — Row-Level vs Table-Level and Shared vs Exclusive",               "Shared (read) locks and exclusive (write) locks, row-level vs page vs table granularity, deadlock detection in InnoDB, and SELECT ... FOR UPDATE."),
      (5, "mvcc",                   "MVCC — How Postgres Avoids Most Read Locks",                               "Multi-Version Concurrency Control: each row version has xmin/xmax, readers see a snapshot, writers create new versions. Vacuum and dead tuple cleanup."),
      (6, "optimistic-pessimistic", "Optimistic vs Pessimistic Locking — Choosing the Right Strategy",          "Pessimistic: lock on read, prevent conflict. Optimistic: detect conflict on write (version column or timestamp). JPA @Version for optimistic locking."),
      (7, "spring-transactional",   "Spring @Transactional — Propagation Levels Explained",                     "REQUIRED (default), REQUIRES_NEW, NESTED, SUPPORTS, NOT_SUPPORTED, MANDATORY, NEVER — what each means for the transaction lifecycle."),
      (8, "transactional-gotchas",  "Spring @Transactional Gotchas — Self-Invocation, Rollback Rules, Proxies", "Self-invocation bypasses the proxy, @Transactional on private methods does nothing, only RuntimeException rolls back by default (rollbackFor), and readOnly hint."),
    ]
  },

  "jpa-hibernate": {
    "order": 9, "prerequisites": ["database-transactions"], "next": "spring-data-jpa",
    "lessons": [
      (1,  "orm-mismatch",           "The Object-Relational Mismatch — Why ORM Exists",                        "Objects: identity, references, inheritance. Tables: rows, foreign keys, joins. The impedance mismatch and the trade-offs ORM makes to bridge it."),
      (2,  "persistence-context",    "EntityManager and the Persistence Context — Unit of Work Pattern",        "The persistence context is a first-level cache and a change tracker. Every entity in the PC has a state. Flush writes dirty entities to the DB."),
      (3,  "entity-states",          "Entity Lifecycle — Transient, Persistent, Detached and Removed",          "Transient: new, not tracked. Persistent: in PC, changes auto-flushed. Detached: was persistent, PC closed. Removed: scheduled for DELETE. State transitions."),
      (4,  "onetomany-manytoone",    "@OneToMany and @ManyToOne — Owning Side, mappedBy and Foreign Keys",      "The owning side holds the foreign key column. mappedBy on the non-owning side. Not setting both sides of a bidirectional association = stale cache."),
      (5,  "manytomany",             "@ManyToMany — Join Tables, Cascade and the Ownership Trap",               "Join table with @JoinTable, cascade types (PERSIST, MERGE, REMOVE — be careful with REMOVE), orphanRemoval, and the performance cost of @ManyToMany."),
      (6,  "n1-detection",           "The N+1 Problem — What It Is and How to Detect It",                       "Loading a list of Orders and accessing each Order's Items triggers N+1 queries. Detecting with Hibernate statistics, p6spy, and datasource-proxy."),
      (7,  "n1-fixes",               "N+1 Fixes — JOIN FETCH, @BatchSize, @EntityGraph and Projections",        "JOIN FETCH in JPQL (Cartesian product risk), @BatchSize for lazy collections, @EntityGraph for declarative eager fetching, and DTO projections as the escape hatch."),
      (8,  "lazy-eager",             "Lazy vs Eager Loading — FetchType Defaults and LazyInitializationException","@ManyToOne and @OneToOne default EAGER (bad). @OneToMany and @ManyToMany default LAZY. LazyInitializationException: accessing a proxy outside an open session."),
      (9,  "open-session-antipattern","The Open Session in View Anti-Pattern",                                    "Loading lazy associations in the view layer requires the session to be open. OSIV filter in Spring: convenient but causes N+1 silently. Always close OSIV in production."),
      (10, "hibernate-l1-cache",     "Hibernate L1 Cache — The Persistence Context as a Cache",                  "entityManager.find() twice returns the same instance. Cache scope is the persistence context (request/transaction). Not useful for cross-request caching."),
      (11, "hibernate-l2-cache",     "Hibernate L2 Cache — Ehcache, Region Configuration and Invalidation",      "@Cache(usage = CacheConcurrencyStrategy.READ_WRITE), cache regions, eviction, and why cache invalidation is one of the two hard problems in CS."),
      (12, "jpql-criteria",          "JPQL and Named Queries — Beyond Simple findById",                          "JPQL syntax (entity names not table names), JOIN FETCH in JPQL, named queries (@NamedQuery), and the Criteria API for type-safe programmatic queries."),
    ]
  },

  "spring-data-jpa": {
    "order": 10, "prerequisites": ["jpa-hibernate"], "next": None,
    "lessons": [
      (1, "repository-hierarchy",   "The JpaRepository Hierarchy — What You Get for Free",                    "Repository → CrudRepository → PagingAndSortingRepository → JpaRepository. Methods inherited at each level. SimpleJpaRepository as the default implementation."),
      (2, "derived-queries",        "Derived Query Methods — How Spring Parses Method Names",                  "findByNameAndAge, findByNameContainingIgnoreCase, findTop5ByOrderByCreatedAtDesc — the parser, the supported keywords, and the limit of what makes sense."),
      (3, "query-annotation",       "@Query — JPQL and Native Queries",                                         "@Query with JPQL (entity-centric), @Query with nativeQuery=true (SQL), @Modifying for UPDATE/DELETE, and @Transactional requirement for write queries."),
      (4, "specification-pattern",  "Specification — Dynamic Queries Without Concatenated Strings",             "JpaSpecificationExecutor, Specification<T> as a composable predicate (and/or/not), building dynamic filter APIs without StringBuilder query concatenation."),
      (5, "interface-projections",  "Interface Projections — Selecting Specific Columns",                       "Declare an interface with only the getters you need. Spring generates a proxy. SELECT only those columns. Open projections (SpEL) vs closed projections."),
      (6, "dto-projections",        "Class (DTO) Projections — Constructor Expressions",                        "JPQL constructor expression: SELECT new com.example.UserDTO(u.id, u.name). Spring Data also supports matching DTO class with constructor that matches selected fields."),
      (7, "dynamic-projections",    "Dynamic Projections — One Method, Multiple Return Types",                  "findBy...(Class<T> type) where T can be any projection type. Switch between full entity, interface projection, and DTO at the call site."),
      (8, "auditing",               "Spring Data Auditing — @CreatedDate, @LastModifiedBy",                    "@EnableJpaAuditing, AuditorAware<String>, @EntityListeners(AuditingEntityListener.class), and automatically populated audit fields."),
      (9, "flyway-liquibase",       "Database Migrations — Flyway vs Liquibase",                               "Flyway: version-based SQL files (V1__init.sql), checksum validation, repair. Liquibase: XML/YAML/SQL changelogs, rollback support, context filtering. Choosing between them."),
    ]
  },

  "java-testing": {
    "order": 11, "prerequisites": ["java-oop-internals"], "next": None,
    "lessons": [
      (1,  "test-pyramid",           "The Test Pyramid — Unit, Integration and E2E in Balance",               "The cost curve (fast/cheap unit to slow/expensive E2E), what each layer verifies, the ice cream cone anti-pattern, and what unit test actually means."),
      (2,  "junit5-architecture",    "JUnit 5 Architecture — Platform, Jupiter and Vintage",                   "JUnit Platform (engine SPI), JUnit Jupiter (new API), JUnit Vintage (JUnit 3/4 runner). The separation that enables third-party test engines."),
      (3,  "junit5-lifecycle",       "JUnit 5 Lifecycle — @BeforeAll, @AfterEach and the Order",              "@BeforeAll (static), @BeforeEach, @Test, @AfterEach, @AfterAll (static). Test instance lifecycle (per-method vs per-class). @TestMethodOrder."),
      (4,  "junit5-extensions",      "JUnit 5 Extensions — @ExtendWith and Building a Custom Extension",       "Extension points (BeforeEachCallback, ParameterResolver, TestInstanceFactory), @RegisterExtension for programmatic extensions, and building a database extension."),
      (5,  "parameterized-tests",    "Parameterized Tests — ValueSource, CsvSource, MethodSource",             "@ParameterizedTest, @ValueSource, @EnumSource, @CsvSource, @CsvFileSource, @MethodSource, and @ArgumentsSource for custom providers."),
      (6,  "test-doubles-theory",    "Test Doubles — Dummy, Stub, Fake, Mock, Spy (The Theory)",              "Meszaros's five types. Dummy: placeholder. Stub: returns canned values. Fake: working simplified implementation. Mock: verifies interactions. Spy: wraps real object."),
      (7,  "mockito-core",           "Mockito — @Mock, @Spy, @InjectMocks in Depth",                          "@Mock creates a proxy. @Spy wraps a real instance. @InjectMocks creates the SUT and injects mocks. when().thenReturn() vs doReturn().when() for spies."),
      (8,  "mockito-advanced",       "Mockito — ArgumentCaptor, Verification Modes and Custom Answers",        "ArgumentCaptor.capture(), InOrder, verify(mock, times(2)), never(), atLeastOnce(), custom Answer implementations, and the over-verification smell."),
      (9,  "spring-test-slices",     "Spring Test Slices — @WebMvcTest, @DataJpaTest and Context Cost",        "@SpringBootTest (full context), @WebMvcTest (web layer only), @DataJpaTest (JPA + H2), @JsonTest. MockMvc vs WebTestClient. The context startup cost."),
      (10, "testcontainers",         "TestContainers — Real Databases in Tests",                               "@Testcontainers + @Container, PostgreSQLContainer, KafkaContainer, single shared container across tests (static field), and the JDBC URL override."),
      (11, "tdd-practice",           "TDD — Red-Green-Refactor in Practice",                                   "The TDD cycle demonstrated on a real feature. Outside-in TDD starting from the use case. The design pressure TDD applies. Test names as living documentation."),
      (12, "mutation-jmh",           "Mutation Testing with PITest and Microbenchmarking with JMH",            "PITest mutates your code and checks if tests catch it. Surviving mutants reveal weak tests. JMH for reliable microbenchmarks: @BenchmarkMode, @State, @Warmup."),
    ]
  },

  "reactive-java": {
    "order": 12, "prerequisites": ["java-completable-future", "spring-boot"], "next": None,
    "lessons": [
      (1,  "backpressure-problem",   "The Backpressure Problem — Why Futures Were Not Enough",                 "Fast producer / slow consumer. Thread blocking as crude backpressure. CompletableFuture has no pull signal. The need for a first-class demand mechanism."),
      (2,  "reactive-streams-spec",  "The Reactive Streams Spec — Publisher, Subscriber, Subscription",        "The four interfaces, Publisher.subscribe(), Subscription.request(n) as the backpressure signal, the 18 spec rules, and interoperability between libraries."),
      (3,  "mono-flux-cold-hot",     "Mono and Flux — Cold vs Hot Publishers",                                  "Mono<T>: 0 or 1 item. Flux<T>: 0-N items. Cold: sequence starts fresh per subscriber. Hot: share() publishes to all current subscribers."),
      (4,  "core-operators",         "Core Operators — map, flatMap, filter, zip and merge",                    "map (synchronous transform), filter, flatMap (async transform, unordered), concatMap (ordered), zip (combine corresponding), merge (interleave)."),
      (5,  "flatmap-vs-switchmap",   "flatMap vs concatMap vs switchMap — When Each Fails You",                 "flatMap: eager, concurrent, unordered. concatMap: sequential, preserves order. switchMap: cancels previous subscription on new item (search box use case)."),
      (6,  "error-handling",         "Error Handling — onErrorReturn, retry and retryWhen",                     "Error terminates the sequence. onErrorReturn (fallback value), onErrorResume (fallback publisher), onErrorMap (rethrow differently), retryWhen with backoff."),
      (7,  "schedulers",             "Schedulers — publishOn vs subscribeOn (The Most Confused Topic)",          "subscribeOn: affects the subscription (source) thread. publishOn: changes thread for downstream operators. Only the first subscribeOn wins. boundedElastic for blocking."),
      (8,  "backpressure-strategies","Backpressure Strategies — Buffer, Drop, Latest and Error",                "When the subscriber can't keep up: onBackpressureBuffer (queue), onBackpressureDrop (discard new), onBackpressureLatest (keep newest), onBackpressureError."),
      (9,  "spring-webflux",         "Spring WebFlux — Reactive HTTP from the Ground Up",                       "Netty's event loop, RouterFunction vs @RestController, WebClient (non-blocking) vs RestTemplate (blocking), and the N+1 trap in reactive controller methods."),
      (10, "r2dbc",                  "Reactive Database Access — R2DBC",                                        "R2DBC ConnectionFactory, DatabaseClient, Spring Data R2DBC repositories, @Transactional in reactive context, and the limitation vs JPA (no L2 cache, no lazy loading)."),
      (11, "testing-reactive",       "Testing Reactive Code — StepVerifier",                                    "StepVerifier.create(flux).expectNext(x).expectNext(y).verifyComplete(), virtual time for time-based operators, and PublisherProbe for side-effect testing."),
      (12, "reactive-vs-virtual",    "Reactive vs Virtual Threads — Choosing the Right Model in 2025",          "Reactive: explicit backpressure, operator DSL, ecosystem (Kafka, R2DBC). Virtual threads: synchronous code, debuggable stack traces, easier migration. Decision framework."),
    ]
  },

}


def slugify_title(title):
    return title

def write_meta(slug, data):
    meta_path = os.path.join(BASE, slug, "_meta.mdx")
    if not os.path.exists(meta_path):
        print(f"  SKIP (no meta): {slug}")
        return
    with open(meta_path, "r", encoding="utf-8") as f:
        content = f.read()
    # Add order, prerequisites, next after the draft line
    prereqs = data["prerequisites"]
    prereq_str = "[" + ", ".join(f'"{p}"' for p in prereqs) + "]"
    next_val = f'"{data["next"]}"' if data["next"] else "null"
    insertion = f'order: {data["order"]}\nprerequisites: {prereq_str}\nnext: {next_val}\n'
    # Insert before closing ---
    content = content.replace("draft: false\n---", f"draft: false\n{insertion}---")
    content = content.replace("draft: true\n---", f"draft: true\n{insertion}---")
    with open(meta_path, "w", encoding="utf-8") as f:
        f.write(content)

def write_stub(slug, num, lesson_slug, title, desc):
    filename = f"{num:02d}-{lesson_slug}.mdx"
    path = os.path.join(BASE, slug, filename)
    if os.path.exists(path):
        return  # don't overwrite
    stub = f"""---
title: "{title}"
courseSlug: "{slug}"
lessonNumber: {num}
description: "{desc}"
date: "{DATE}"
draft: true
---

## Coming Soon

This lesson is being written.
"""
    with open(path, "w", encoding="utf-8") as f:
        f.write(stub)

total_lessons = 0
for slug, data in COURSES.items():
    course_dir = os.path.join(BASE, slug)
    if not os.path.exists(course_dir):
        print(f"MISSING directory: {slug}")
        continue
    write_meta(slug, data)
    for lesson in data["lessons"]:
        num, lslug, title, desc = lesson
        write_stub(slug, num, lslug, title, desc)
        total_lessons += 1
    print(f"OK  {slug:45s} ({len(data['lessons'])} lessons)")

print(f"\nTotal lessons created: {total_lessons}")
