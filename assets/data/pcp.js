/* PCP — ported 1:1 from the canvas "Concurrent & Parallel Programming: exam prep" (lessons, step-through visuals, 9 patterns, 12 past-paper exercises with hint → plan → Java, concept checks, 2 mocks, cheat sheet). */
(function () {
var SRC = {
  Papers: ["From the 2024 DS papers", "D'après les DS 2024"],
  TD1: ["From TD1", "D'après le TD1"],
  "Lesson check": ["Lesson check", "Vérif de leçon"],
};
var LESSONS = [
  { id: "thr", label: ["1. Threads in Java", "1. Les threads en Java"] },
  { id: "cs", label: ["2. Critical section & mutual exclusion", "2. Section critique & exclusion mutuelle"] },
  { id: "sem", label: ["3. Semaphores (P/V, Java Semaphore)", "3. Sémaphores (P/V, Semaphore Java)"] },
  { id: "ord", label: ["4. Ordering schemes (DS Ex1)", "4. Schémas d'ordre (DS Ex1)"] },
  { id: "story", label: ["5. Story problems: bridge, bakery, smokers, board", "5. Problèmes : pont, boulangerie, fumeurs, planche"] },
  { id: "mon", label: ["6. Monitors (ReentrantLock + Condition)", "6. Moniteurs (ReentrantLock + Condition)"] },
];
var MATERIALS = [
  { title: ["PCP course page", "Page du cours PCP"], path: "course/view.php?id=973", kind: ["Course", "Cours"] },
  { title: ["Introduction (threads in Java)", "Introduction (threads en Java)"], path: "mod/folder/view.php?id=6096", kind: ["Folder", "Dossier"] },
  { title: ["Cours Sémaphore", "Cours Sémaphore"], path: "mod/folder/view.php?id=6097", kind: ["Folder", "Dossier"] },
  { title: ["TD Sémaphore (TD1)", "TD Sémaphore (TD1)"], path: "mod/folder/view.php?id=6165", kind: ["Folder", "Dossier"] },
  { title: ["Moniteur", "Moniteur"], path: "mod/folder/view.php?id=7421", kind: ["Folder", "Dossier"] },
  { title: ["Révision (DS 2024)", "Révision (DS 2024)"], path: "mod/folder/view.php?id=7472", kind: ["Folder", "Dossier"] },
];
var BANK = [
  // threads
  { id: "T1", s: "Lesson check", t: "thr", m: false, q: ["What happens if you call `T1.run()` instead of `T1.start()`?", "Que se passe-t-il si on appelle `T1.run()` au lieu de `T1.start()` ?"], o: [["A new thread starts and runs `run()` in parallel", "Un nouveau thread démarre et exécute `run()` en parallèle"], ["The thread goes straight to the dead state", "Le thread passe directement à l'état mort"], ["The code of `run()` runs sequentially inside main; no new thread is created", "Le code de `run()` s'exécute séquentiellement dans main ; aucun thread n'est créé"], ["Compile error", "Erreur de compilation"]], a: [2], w: ["`run()` is a plain method call. Only `start()` creates the thread, which then calls `run()` itself.", "`run()` est un simple appel de méthode. Seul `start()` crée le thread, qui appelle ensuite `run()` lui-même."] },
  { id: "T2", s: "Lesson check", t: "thr", m: false, q: ["main starts T1 and T2, then prints \"je suis dans main\". Where can that line appear in the output?", "main lance T1 et T2, puis affiche « je suis dans main ». Où cette ligne peut-elle apparaître ?"], o: [["Always first", "Toujours en premier"], ["Always last", "Toujours en dernier"], ["Never: main stops after `start()`", "Jamais : main s'arrête après `start()`"], ["Anywhere among the lines of T1 and T2: main is a thread too, and the scheduler interleaves", "N'importe où parmi les lignes de T1 et T2 : main est aussi un thread, et l'ordonnanceur entrelace"]], a: [3], w: ["Without `join()`, the order between main and the threads is not fixed.", "Sans `join()`, l'ordre entre main et les threads n'est pas fixé."] },
  { id: "T3", s: "Lesson check", t: "thr", m: false, q: ["How do you make \"fin de main\" always print last?", "Comment faire pour que « fin de main » s'affiche toujours en dernier ?"], o: [["`T1.join(); T2.join();` before it, inside try/catch", "`T1.join(); T2.join();` avant, dans un try/catch"], ["`Thread.sleep(100);` before it", "`Thread.sleep(100);` avant"], ["`Thread.yield();` before it", "`Thread.yield();` avant"], ["Call `T1.start()` a second time", "Rappeler `T1.start()`"]], a: [0], w: ["`join()` makes main wait for the end of each thread. sleep only makes it likely; yield gives no guarantee.", "`join()` fait attendre main jusqu'à la fin de chaque thread. sleep le rend seulement probable ; yield ne garantit rien."] },
  { id: "T4", s: "Lesson check", t: "thr", m: false, q: ["Your class already `extends Mere`. How do you make it run as a thread?", "Votre classe fait déjà `extends Mere`. Comment l'exécuter comme un thread ?"], o: [["`class A extends Mere, Thread`", "`class A extends Mere, Thread`"], ["`class A extends Mere implements Runnable`, then `new Thread(new A()).start()`", "`class A extends Mere implements Runnable`, puis `new Thread(new A()).start()`"], ["Impossible in Java", "Impossible en Java"], ["Call `run()` directly from main", "Appeler `run()` directement depuis main"]], a: [1], w: ["Java has no multiple inheritance of classes, so you implement `Runnable` and hand the object to a `Thread`.", "Java n'a pas d'héritage multiple de classes : on implémente `Runnable` et on passe l'objet à un `Thread`."] },
  { id: "T5", s: "Lesson check", t: "thr", m: true, q: ["Which events put a thread in the \"en attente / bloqué\" state?", "Quels événements mettent un thread dans l'état « en attente / bloqué » ?"], o: ["`sleep(ms)`", ["The end of `run()`", "La fin de `run()`"], "`wait()`", ["A blocking I/O", "Une E/S bloquante"], "`start()`"], a: [0, 2, 3], w: ["End of `run()` leads to mort; `start()` leads to exécutable. A waiting thread uses no CPU.", "La fin de `run()` mène à l'état mort ; `start()` à exécutable. Un thread en attente n'utilise pas le CPU."] },
  { id: "T6", s: "Lesson check", t: "thr", m: false, q: ["`join()` is…", "`join()` est…"], o: [["A static method: `Thread.join()`", "Une méthode statique : `Thread.join()`"], ["A method that stops the thread", "Une méthode qui arrête le thread"], ["The same as `yield()`", "La même chose que `yield()`"], ["An instance method: `t.join()` waits for the end of t", "Une méthode d'instance : `t.join()` attend la fin de t"]], a: [3], w: ["The slide lists it as static, but it is an instance method. `yield()` only offers the CPU to another thread.", "La slide la présente comme statique, mais c'est une méthode d'instance. `yield()` cède seulement le CPU à un autre thread."] },
  { id: "T7", s: "Lesson check", t: "thr", m: false, q: ["Parallel merge sort (TriFusion): why does main call `t1.join(); t2.join();` before the merge?", "Tri fusion parallèle : pourquoi main appelle `t1.join(); t2.join();` avant la fusion ?"], o: [["To start the two threads", "Pour démarrer les deux threads"], ["Because the merge needs both halves already sorted", "Parce que la fusion a besoin des deux moitiés déjà triées"], ["To raise the threads' priority", "Pour augmenter la priorité des threads"], ["It is optional", "C'est facultatif"]], a: [1], w: ["Each thread sorts one half; merging before both have finished would mix unsorted data.", "Chaque thread trie une moitié ; fusionner avant la fin des deux mélangerait des données non triées."] },
  // critical section
  { id: "C1", s: "Lesson check", t: "cs", m: false, q: ["nb_places = 1 and two clients run `if (nb_places > 0) nb_places = nb_places - 1;` with no protection. How can we end with −1?", "nb_places = 1 et deux clients exécutent `if (nb_places > 0) nb_places = nb_places - 1;` sans protection. Comment finir à −1 ?"], o: [["Java integers overflow", "Les entiers Java débordent"], ["Both test `> 0` before either one decrements", "Les deux testent `> 0` avant que l'un ne décrémente"], ["The second client decrements twice", "Le second client décrémente deux fois"], ["It cannot happen", "C'est impossible"]], a: [1], w: ["Both see 1, both pass the test, both decrement: 1 → 0 → −1.", "Les deux voient 1, passent le test, décrémentent : 1 → 0 → −1."] },
  { id: "C2", s: "Lesson check", t: "cs", m: false, q: ["The critical section (section critique) is…", "La section critique est…"], o: [["The whole main method", "Toute la méthode main"], ["The code that creates the threads", "Le code qui crée les threads"], ["The code that accesses the shared variable", "Le code qui accède à la variable partagée"], ["Any code inside `run()`", "Tout le code de `run()`"]], a: [2], w: ["It is surrounded by an entry protocol and an exit protocol.", "Elle est encadrée par un protocole d'entrée et un protocole de sortie."] },
  { id: "C3", s: "Lesson check", t: "cs", m: false, q: ["Two processes are in the critical section at the same time. Which property is violated?", "Deux processus sont en section critique en même temps. Quelle propriété est violée ?"], o: [["Liveness (vivacité)", "Vivacité"], ["Robustness (robustesse)", "Robustesse"], ["Safety (sûreté)", "Sûreté"], ["None", "Aucune"]], a: [2], w: ["Sûreté = never two in the SC. Vivacité = whoever wants eventually enters. Robustesse = a process outside does not block the others.", "Sûreté = jamais deux en SC. Vivacité = qui le demande finit par entrer. Robustesse = un processus hors SC ne bloque pas les autres."] },
  { id: "C4", s: "Lesson check", t: "cs", m: false, q: ["A process asks to enter the SC and waits forever. Which property is violated?", "Un processus demande la SC et attend indéfiniment. Quelle propriété est violée ?"], o: [["Liveness (vivacité)", "Vivacité"], ["Safety (sûreté)", "Sûreté"], ["Robustness (robustesse)", "Robustesse"], ["Atomicity", "Atomicité"]], a: [0], w: ["Vivacité: every request is eventually satisfied.", "Vivacité : toute demande finit par être satisfaite."] },
  { id: "C5", s: "TD1", t: "cs", m: false, q: ["TD1 Ex1 trace: at what moment must P1 be \"paused\" for both to end up in the SC?", "Trace du TD1 Ex1 : à quel moment faut-il « suspendre » P1 pour que les deux entrent en SC ?"], o: [["Before `flag[1] = true`", "Avant `flag[1] = true`"], ["Inside the SC", "Dans la SC"], ["After `flag[1] = false`", "Après `flag[1] = false`"], ["After passing the `flag[0]` test, before `token = 1`", "Après le test sur `flag[0]`, avant `token = 1`"]], a: [3], w: ["P1 sees flag[0] = false, is preempted; P0 raises its flag and enters (token = 0); P1 then writes token = 1 and enters too.", "P1 voit flag[0] = false, est préempté ; P0 lève son drapeau et entre (token = 0) ; P1 écrit ensuite token = 1 et entre aussi."] },
  { id: "C6", s: "TD1", t: "cs", m: false, q: ["Why is the TD1 Ex1 algorithm false?", "Pourquoi l'algorithme du TD1 Ex1 est-il faux ?"], o: [["Testing `flag[j]` then writing `token` is not atomic: the other process can slip in between", "Tester `flag[j]` puis écrire `token` n'est pas atomique : l'autre processus peut s'intercaler"], ["It always deadlocks", "Il se bloque toujours"], ["token is never modified", "token n'est jamais modifié"], ["flag is not initialised", "flag n'est pas initialisé"]], a: [0], w: ["The trace proves a safety violation (sûreté). A semaphore fixes it.", "La trace prouve une violation de la sûreté. Un sémaphore règle le problème."] },
  { id: "C7", s: "Lesson check", t: "cs", m: false, q: ["How do you fix the plane booking race?", "Comment corriger la course critique de la réservation ?"], o: [["Put only the decrement inside the mutex", "Mettre seulement la décrémentation sous mutex"], ["Add `Thread.sleep` before the test", "Ajouter `Thread.sleep` avant le test"], ["Put the test and the decrement together inside the mutex", "Mettre le test et la décrémentation ensemble sous le mutex"], ["Use one semaphore per client", "Utiliser un sémaphore par client"]], a: [2], w: ["The test and the update must be one exclusive (atomic) block, otherwise both clients can still pass the test.", "Le test et la mise à jour doivent former un seul bloc exclusif (atomique), sinon les deux clients passent encore le test."] },
  // semaphores
  { id: "S1", s: "Lesson check", t: "sem", m: false, q: ["Initial value of a semaphore used as a mutex, and of one used for \"B must wait for A\"?", "Valeur initiale d'un sémaphore mutex, et d'un sémaphore « B doit attendre A » ?"], o: [["0 and 1", "0 et 1"], ["1 and 0", "1 et 0"], ["1 and 1", "1 et 1"], ["k and 0", "k et 0"]], a: [1], w: ["1 = one free resource; 0 = wait until someone signals; k = k identical resources.", "1 = une ressource libre ; 0 = attendre un signal ; k = k ressources identiques."] },
  { id: "S2", s: "Lesson check", t: "sem", m: false, q: ["What does `s.acquire(3)` do when only 2 permits are available?", "Que fait `s.acquire(3)` quand seulement 2 jetons sont disponibles ?"], o: [["Takes 2 now and waits for the 3rd", "Prend 2 maintenant et attend le 3e"], ["Throws an exception", "Lève une exception"], ["Returns false immediately", "Renvoie false immédiatement"], ["Blocks until 3 are available, then takes all 3 at once", "Bloque jusqu'à ce que 3 soient disponibles, puis les prend d'un coup"]], a: [3], w: ["acquire(n) is all-or-nothing. That is why a truck must not do 3 separate acquire().", "acquire(n) est tout ou rien. C'est pour cela qu'un camion ne doit pas faire 3 acquire() séparés."] },
  { id: "S3", s: "Lesson check", t: "sem", m: false, q: ["Why is `new Semaphore(3, true)` useful on the bridge?", "Pourquoi `new Semaphore(3, true)` est-il utile sur le pont ?"], o: [["true = FIFO order, so trucks are not starved by cars", "true = ordre FIFO, donc les camions ne sont pas affamés par les voitures"], ["true = the semaphore can go negative", "true = le sémaphore peut devenir négatif"], ["true = 3 is the maximum", "true = 3 est le maximum"], ["true = it is a binary semaphore", "true = c'est un sémaphore binaire"]], a: [0], w: ["With fairness, a car arriving after a waiting truck queues behind it instead of overtaking.", "Avec l'équité, une voiture qui arrive après un camion en attente se place derrière lui au lieu de le doubler."] },
  { id: "S4", s: "Lesson check", t: "sem", m: false, q: ["Why must `release()` be called even on the error path?", "Pourquoi `release()` doit-il être appelé même en cas d'erreur ?"], o: [["Otherwise Java will not compile", "Sinon Java ne compile pas"], ["Otherwise the permit is lost and the others block forever", "Sinon le jeton est perdu et les autres sont bloqués pour toujours"], ["To print the result", "Pour afficher le résultat"], ["It is not needed", "Ce n'est pas nécessaire"]], a: [1], w: ["Every acquire needs exactly one matching release on every path.", "Chaque acquire doit avoir exactement un release sur tous les chemins."] },
  { id: "S5", s: "Lesson check", t: "sem", m: true, q: ["Which statements about P and V are correct?", "Quelles affirmations sur P et V sont correctes ?"], o: [["P(s): if s > 0 then s := s − 1, else the process waits", "P(s) : si s > 0 alors s := s − 1, sinon le processus attend"], ["V(s): s := s + 1, and a waiting process can then continue", "V(s) : s := s + 1, et un processus en attente peut alors continuer"], ["P and V are indivisible (atomic)", "P et V sont indivisibles (atomiques)"], ["A V with nobody waiting is lost", "Un V sans personne en attente est perdu"]], a: [0, 1, 2], w: ["A semaphore remembers a V (s goes up). It is the monitor's signal() that is lost when nobody waits.", "Un sémaphore mémorise un V (s augmente). C'est le signal() du moniteur qui est perdu si personne n'attend."] },
  { id: "S6", s: "Lesson check", t: "sem", m: false, q: ["In `java.util.concurrent.Semaphore`, P(s) and V(s) are…", "Dans `java.util.concurrent.Semaphore`, P(s) et V(s) sont…"], o: [["`wait()` / `notify()`", "`wait()` / `notify()`"], ["`lock()` / `unlock()`", "`lock()` / `unlock()`"], ["`acquire()` / `release()`", "`acquire()` / `release()`"], ["`aquire()` / `release()`", "`aquire()` / `release()`"]], a: [2], w: ["The slides write \"aquire\": the real name is `acquire`. lock/unlock belong to `ReentrantLock` (monitors).", "Les slides écrivent « aquire » : le vrai nom est `acquire`. lock/unlock appartiennent à `ReentrantLock` (moniteurs)."] },
  // ordering
  { id: "O1", s: "Papers", t: "ord", m: false, q: ["DS 2024 Ex1 Q1, token ring: Pi does `si.acquire(); Ai; s(i+1).release();`. Initial values?", "DS 2024 Ex1 Q1, anneau à jeton : Pi fait `si.acquire(); Ai; s(i+1).release();`. Valeurs initiales ?"], o: ["s1 = 0, s2 = 0, s3 = 0", "s1 = 1, s2 = 1, s3 = 1", "s1 = 1, s2 = 0, s3 = 0", "s1 = 3, s2 = 0, s3 = 0"], a: [2], w: ["All 0: nobody starts (deadlock). All 1: everyone runs at once. One token: A1 A2 A3.", "Tous à 0 : personne ne démarre (interblocage). Tous à 1 : tous s'exécutent en même temps. Un seul jeton : A1 A2 A3."] },
  { id: "O2", s: "Papers", t: "ord", m: false, q: ["DS Ex1 Q2 (sA1 = 1, sA23 = 0): why can't A2 and A3 both run after one A1?", "DS Ex1 Q2 (sA1 = 1, sA23 = 0) : pourquoi A2 et A3 ne peuvent-elles pas s'exécuter toutes deux après un seul A1 ?"], o: [["Because A2 always runs first", "Parce que A2 passe toujours en premier"], ["Because A1 releases only one permit on sA23", "Parce que A1 ne libère qu'un seul jeton sur sA23"], ["Because sA23 is a mutex", "Parce que sA23 est un mutex"], ["They can", "Elles le peuvent"]], a: [1], w: ["One A1 = one release on sA23 = exactly one of A2 / A3, which then releases sA1.", "Un A1 = un release sur sA23 = exactement une de A2 / A3, qui libère ensuite sA1."] },
  { id: "O3", s: "Papers", t: "ord", m: false, q: ["Which output is possible with the DS Ex1 Q2 solution?", "Quelle sortie est possible avec la solution du DS Ex1 Q2 ?"], o: ["A1 A2 A3 A1", "A2 A1 A3 A1", "A1 A1 A2 A3", "A1 A3 A1 A2"], a: [3], w: ["Always A1, then A2 or A3, then A1 again…", "Toujours A1, puis A2 ou A3, puis de nouveau A1…"] },
  { id: "O4", s: "Papers", t: "ord", m: false, q: ["DS Ex1 Q1 imposes 3 semaphores. To only forbid simultaneous Ai, what is the minimum?", "Le DS Ex1 Q1 impose 3 sémaphores. Pour seulement interdire la simultanéité des Ai, quel est le minimum ?"], o: [["One semaphore initialised to 1", "Un sémaphore initialisé à 1"], ["Three semaphores initialised to 0", "Trois sémaphores initialisés à 0"], ["Two semaphores", "Deux sémaphores"], ["None", "Aucun"]], a: [0], w: ["A single mutex works; the 3-semaphore token ring also fixes the order A1 A2 A3. Answer what is asked: 3 semaphores.", "Un seul mutex suffit ; l'anneau à 3 sémaphores fixe aussi l'ordre A1 A2 A3. Répondez à ce qui est demandé : 3 sémaphores."] },
  { id: "O5", s: "Lesson check", t: "ord", m: false, q: ["\"B must run after A\". Which scheme is right?", "« B doit s'exécuter après A ». Quel schéma est correct ?"], o: [["`s = new Semaphore(1)`; A then `s.release()`; `s.acquire()` then B", "`s = new Semaphore(1)` ; A puis `s.release()` ; `s.acquire()` puis B"], ["`s = new Semaphore(0)`; A then `s.release()`; `s.acquire()` then B", "`s = new Semaphore(0)` ; A puis `s.release()` ; `s.acquire()` puis B"], ["`s = new Semaphore(0)`; `s.acquire()` then A; B then `s.release()`", "`s = new Semaphore(0)` ; `s.acquire()` puis A ; B puis `s.release()`"], ["No semaphore: start A before B", "Pas de sémaphore : démarrer A avant B"]], a: [1], w: ["0 makes B wait; A's release is the signal. With 1, B could pass before A. Start order guarantees nothing.", "0 fait attendre B ; le release de A est le signal. Avec 1, B pourrait passer avant A. L'ordre des start ne garantit rien."] },
  // story problems
  { id: "B1", s: "Papers", t: "story", m: false, q: ["Bridge (DS 2024 Ex2): 15 t max, trucks 15 t, cars 5 t, `charge = new Semaphore(3, true)`. What does a truck do?", "Pont (DS 2024 Ex2) : 15 t max, camions 15 t, voitures 5 t, `charge = new Semaphore(3, true)`. Que fait un camion ?"], o: ["`charge.acquire()`", "`charge.acquire(15)`", ["`charge.acquire(3)`, then `charge.release(3)` when it leaves", "`charge.acquire(3)`, puis `charge.release(3)` en sortant"], ["Three calls `charge.acquire()` in a row", "Trois appels `charge.acquire()` à la suite"]], a: [2], w: ["Units of 5 t: car = 1, truck = 3. (Also valid: `Semaphore(15)` with acquire(5) / acquire(15).)", "Unités de 5 t : voiture = 1, camion = 3. (Aussi valable : `Semaphore(15)` avec acquire(5) / acquire(15).)"] },
  { id: "B2", s: "Papers", t: "story", m: false, q: ["Why not let a truck call `charge.acquire()` three times?", "Pourquoi ne pas faire trois `charge.acquire()` pour un camion ?"], o: [["It is slower", "C'est plus lent"], ["`acquire()` cannot be called twice", "`acquire()` ne peut pas être appelé deux fois"], ["It would let 4 cars on", "Cela laisserait passer 4 voitures"], ["Two trucks can each grab part of the units and wait forever for the rest: deadlock", "Deux camions peuvent chacun prendre une partie des unités et attendre le reste pour toujours : interblocage"]], a: [3], w: ["acquire(3) is all-or-nothing and avoids that partial hold.", "acquire(3) est tout ou rien et évite cette prise partielle."] },
  { id: "B3", s: "Lesson check", t: "story", m: false, q: ["Tutor variant of the bridge: no weight limit, but at most N vehicles at a time. What changes?", "Variante du tuteur : pas de limite de poids, mais au plus N véhicules à la fois. Qu'est-ce qui change ?"], o: [["`places = new Semaphore(N, true)`; every vehicle takes 1 permit", "`places = new Semaphore(N, true)` ; chaque véhicule prend 1 jeton"], ["`new Semaphore(0)` and `release(N)` in main", "`new Semaphore(0)` et `release(N)` dans main"], ["A truck takes N permits", "Un camion prend N jetons"], ["Nothing changes", "Rien ne change"]], a: [0], w: ["Each vehicle counts as one place, whatever its weight.", "Chaque véhicule compte pour une place, quel que soit son poids."] },
  { id: "B4", s: "Papers", t: "story", m: false, q: ["Why do `nb++` / `nb--` (vehicles on the bridge) need `mutex = new Semaphore(1)`?", "Pourquoi `nb++` / `nb--` (véhicules sur le pont) ont-ils besoin de `mutex = new Semaphore(1)` ?"], o: [["To limit the weight", "Pour limiter le poids"], ["Several cars are on the bridge together, so they can update nb at the same time", "Plusieurs voitures sont sur le pont ensemble, elles peuvent modifier nb en même temps"], ["Because nb is static", "Parce que nb est static"], ["It is optional", "C'est facultatif"]], a: [1], w: ["charge lets up to 3 cars in at once, so nb is a shared counter: protect it with its own mutex.", "charge laisse entrer jusqu'à 3 voitures à la fois : nb est un compteur partagé, à protéger par son propre mutex."] },
  { id: "B5", s: "TD1", t: "story", m: false, q: ["Bakery (TD1 Ex2): why must a seller not call `dispo.acquire(k)` while holding the mutex?", "Boulangerie (TD1 Ex2) : pourquoi un vendeur ne doit-il pas appeler `dispo.acquire(k)` en tenant le mutex ?"], o: [["It would print twice", "Cela afficherait deux fois"], ["dispo would become negative", "dispo deviendrait négatif"], ["Deadlock: the bakers can never take the mutex to deposit", "Interblocage : les boulangers ne peuvent plus prendre le mutex pour déposer"], ["No reason", "Aucune raison"]], a: [2], w: ["Rule: never block on a resource while holding the mutex.", "Règle : ne jamais se bloquer sur une ressource en tenant le mutex."] },
  { id: "B6", s: "TD1", t: "story", m: false, q: ["Bakery: initial values of `mutex` and `dispo` (number of baguettes available)?", "Boulangerie : valeurs initiales de `mutex` et `dispo` (baguettes disponibles) ?"], o: ["mutex = 1, dispo = 0", "mutex = 0, dispo = 1", "mutex = 1, dispo = x", "mutex = N, dispo = M"], a: [0], w: ["The basket is free (1) and starts empty (0). Each deposit does `dispo.release()`.", "Le panier est libre (1) et commence vide (0). Chaque dépôt fait `dispo.release()`."] },
  { id: "B7", s: "TD1", t: "story", m: false, q: ["Smokers (TD1 Ex3), deadlock-free version: who releases `agent`?", "Fumeurs (TD1 Ex3), version sans interblocage : qui libère `agent` ?"], o: [["The agent itself, after putting the ingredients", "L'agent lui-même, après avoir posé les ingrédients"], ["Any smoker, as soon as it starts", "N'importe quel fumeur, dès son démarrage"], ["The smoker who has just smoked", "Le fumeur qui vient de fumer"], ["Nobody: agent starts at 3", "Personne : agent commence à 3"]], a: [2], w: ["agent = 1, fumeur[i] = 0. The agent picks i and releases fumeur[i]; that smoker smokes, then releases agent.", "agent = 1, fumeur[i] = 0. L'agent choisit i et libère fumeur[i] ; ce fumeur fume puis libère agent."] },
  { id: "B8", s: "Papers", t: "story", m: false, q: ["Board (GLID 2024 Ex1 Q2): at most 2 of the 3 employee types, `types = new Semaphore(2, true)`. Who calls `types.acquire()`?", "Planche (GLID 2024 Ex1 Q2) : au plus 2 des 3 types, `types = new Semaphore(2, true)`. Qui appelle `types.acquire()` ?"], o: [["Every employee, on arrival", "Chaque employé, à l'arrivée"], ["Only the first employee of its type to arrive (nb[type] goes 0 → 1)", "Seulement le premier employé de son type (nb[type] passe de 0 à 1)"], ["Only the last one to leave", "Seulement le dernier à partir"], ["Nobody", "Personne"]], a: [1], w: ["First in takes the type slot, last out (nb[type] back to 0) releases it, under a per-type mutex.", "Le premier arrivé prend la place du type, le dernier sorti (nb[type] revient à 0) la libère, sous un mutex par type."] },
  { id: "B9", s: "Papers", t: "story", m: false, q: ["Board (GLID Ex1 Q1): `t_utilisation` is updated after use and before releasing the board. How many semaphores?", "Planche (GLID Ex1 Q1) : `t_utilisation` est mis à jour après l'usage et avant la libération. Combien de sémaphores ?"], o: [["Two: one for the board, one for t_utilisation", "Deux : un pour la planche, un pour t_utilisation"], ["One `Semaphore(1)` for the board; it also protects t_utilisation", "Un `Semaphore(1)` pour la planche ; il protège aussi t_utilisation"], ["Three", "Trois"], ["None", "Aucun"]], a: [1], w: ["The update happens while the employee still holds the board, so it is already exclusive.", "La mise à jour a lieu pendant que l'employé tient encore la planche : elle est déjà exclusive."] },
  { id: "B10", s: "Papers", t: "story", m: false, q: ["Board (GLID Ex1 Q3): at most N packets at a time. What is added?", "Planche (GLID Ex1 Q3) : au plus N paquets à la fois. Qu'ajoute-t-on ?"], o: [["`placesPaquets = new Semaphore(N, true)`; `acquire(paquets)` before depositing, `release(paquets)` when leaving", "`placesPaquets = new Semaphore(N, true)` ; `acquire(paquets)` avant de déposer, `release(paquets)` en partant"], ["A second `types` semaphore", "Un second sémaphore `types`"], ["`Thread.sleep(N)`", "`Thread.sleep(N)`"], ["`new Semaphore(0)`", "`new Semaphore(0)`"]], a: [0], w: ["Same capacity pattern as the bridge: a counting semaphore with acquire(n).", "Même schéma de capacité que le pont : un sémaphore compteur avec acquire(n)."] },
  // monitors
  { id: "M1", s: "Lesson check", t: "mon", m: false, q: ["In a monitor, what does `signal(c)` do if nobody waits on c?", "Dans un moniteur, que fait `signal(c)` si personne n'attend sur c ?"], o: [["c remembers it, like V(s)", "c le mémorise, comme V(s)"], ["It blocks the caller", "Il bloque l'appelant"], ["Nothing: the signal is lost", "Rien : le signal est perdu"], ["It throws an exception", "Il lève une exception"]], a: [2], w: ["A condition does not count; a semaphore does (V(s) adds 1, remembered).", "Une condition ne compte pas ; un sémaphore si (V(s) ajoute 1, mémorisé)."] },
  { id: "M2", s: "Lesson check", t: "mon", m: false, q: ["Why is `unlock()` written in `finally`?", "Pourquoi `unlock()` est-il écrit dans `finally` ?"], o: [["To always release the lock, even on an exception or a return", "Pour toujours libérer le verrou, même en cas d'exception ou de return"], ["Because Java requires it", "Parce que Java l'exige"], ["To make it faster", "Pour aller plus vite"], ["To wake all threads", "Pour réveiller tous les threads"]], a: [0], w: ["In entrer(), `return false` happens inside try: finally still unlocks.", "Dans entrer(), le `return false` est dans le try : finally déverrouille quand même."] },
  { id: "M3", s: "Lesson check", t: "mon", m: false, q: ["What does `c.await()` do with the lock?", "Que fait `c.await()` avec le verrou ?"], o: [["Keeps it while waiting", "Le garde pendant l'attente"], ["Releases it while waiting and re-acquires it on wake-up", "Le libère pendant l'attente et le reprend au réveil"], ["Destroys it", "Le détruit"], ["Nothing, await does not touch the lock", "Rien, await ne touche pas au verrou"]], a: [1], w: ["wait(c) always blocks and frees the monitor, otherwise nobody could enter to signal.", "wait(c) bloque toujours et libère le moniteur, sinon personne ne pourrait entrer pour signaler."] },
  { id: "M4", s: "Lesson check", t: "mon", m: false, q: ["Is `ReentrantLock` a class or an interface?", "`ReentrantLock` est-elle une classe ou une interface ?"], o: [["An interface; `Lock` is the class", "Une interface ; `Lock` est la classe"], ["An annotation", "Une annotation"], ["A keyword", "Un mot-clé"], ["A class; `Lock` is the interface", "Une classe ; `Lock` est l'interface"]], a: [3], w: ["`Lock l = new ReentrantLock(true);` then `Condition c = l.newCondition();`", "`Lock l = new ReentrantLock(true);` puis `Condition c = l.newCondition();`"] },
  { id: "M5", s: "Lesson check", t: "mon", m: false, q: ["Why write `while (occupee) salleVide.await();` and not `if`?", "Pourquoi écrire `while (occupee) salleVide.await();` et pas `if` ?"], o: [["while is faster", "while est plus rapide"], ["if does not compile with await", "if ne compile pas avec await"], ["A woken thread must re-check the condition before going on", "Un thread réveillé doit revérifier la condition avant de continuer"], ["No difference", "Aucune différence"]], a: [2], w: ["Between the signal and the re-acquisition of the lock, another thread may take the room again.", "Entre le signal et la reprise du verrou, un autre thread peut reprendre la salle."] },
  { id: "M6", s: "Papers", t: "mon", m: false, q: ["Baggage room (GLID Ex2): a traveller arrives, the room is busy and all 5 chairs are taken. What does `entrer()` do?", "Salle de bagages (GLID Ex2) : un voyageur arrive, la salle est occupée et les 5 chaises sont prises. Que fait `entrer()` ?"], o: [["Waits with `await()` anyway", "Attend quand même avec `await()`"], ["Prints that he leaves for another room and returns false", "Affiche qu'il part vers une autre salle et renvoie false"], ["Throws an exception", "Lève une exception"], ["Calls `signal()`", "Appelle `signal()`"]], a: [1], w: ["The chairs test comes before waiting: `if (enAttente == CHAISES) { print \"part\"; return false; }`.", "Le test des chaises vient avant l'attente : `if (enAttente == CHAISES) { afficher « part » ; return false; }`."] },
  { id: "M7", s: "Lesson check", t: "mon", m: false, q: ["How many processes can be active inside a monitor at the same time?", "Combien de processus peuvent être actifs dans un moniteur en même temps ?"], o: [["One", "Un seul"], ["Two", "Deux"], ["One per condition variable", "Un par variable condition"], ["Unlimited", "Illimité"]], a: [0], w: ["Rule 1, mutual exclusion: delayed calls wait in a FIFO entry queue. Condition queues are FIFO too.", "Règle 1, exclusion mutuelle : les appels retardés attendent dans une file d'entrée FIFO. Les files des conditions sont aussi FIFO."] },
];
var MOCK = {
  A: ["T1", "T3", "T5", "C1", "C3", "C5", "S1", "S2", "S5", "O1", "O2", "B1", "B5", "B8", "M1", "M5"],
  B: ["T2", "T4", "T6", "C4", "C6", "C7", "S3", "S4", "S6", "O3", "O5", "B2", "B3", "B7", "M2", "M6"],
};
var RACE = {
  none: [
    { who: 0, txt: ["test `nb_places > 0`: true", "test `nb_places > 0` : vrai"], nb: 1 },
    { who: 1, txt: ["test `nb_places > 0`: true", "test `nb_places > 0` : vrai"], nb: 1 },
    { who: 0, txt: "`nb_places = nb_places - 1`", nb: 0 },
    { who: 1, txt: ["`nb_places = nb_places - 1`: overbooked!", "`nb_places = nb_places - 1` : surréservation !"], nb: -1, bad: true },
  ],
  mutex: [
    { who: 0, txt: "`mutex.acquire()`", nb: 1 },
    { who: 0, txt: ["test `nb_places > 0`: true", "test `nb_places > 0` : vrai"], nb: 1 },
    { who: 1, txt: ["`mutex.acquire()`: blocked", "`mutex.acquire()` : bloqué"], nb: 1, blocked: true },
    { who: 0, txt: "`nb_places = nb_places - 1`", nb: 0 },
    { who: 0, txt: ["`mutex.release()`: C2 continues", "`mutex.release()` : C2 continue"], nb: 0 },
    { who: 1, txt: ["test `nb_places > 0`: false, \"plus de places\"", "test `nb_places > 0` : faux, « plus de places »"], nb: 0 },
    { who: 1, txt: "`mutex.release()`", nb: 0 },
  ],
};
var TL = {
  start: [
    { lane: 0, a: 0, b: 10, kind: "run", label: ["main: start(), start(), \"je suis dans main\", \"fin de main\"", "main : start(), start(), « je suis dans main », « fin de main »"] },
    { lane: 1, a: 1, b: 7, kind: "run", label: ["T1.run() in its own thread", "T1.run() dans son propre thread"] },
    { lane: 2, a: 1.6, b: 8.4, kind: "run", label: ["T2.run() in parallel", "T2.run() en parallèle"] },
  ],
  run: [
    { lane: 0, a: 0, b: 1, kind: "run", label: "main" },
    { lane: 0, a: 1, b: 4.5, kind: "call", label: ["T1.run(): a plain call", "T1.run() : simple appel"] },
    { lane: 0, a: 4.5, b: 8, kind: "call", label: ["then T2.run()", "puis T2.run()"] },
    { lane: 0, a: 8, b: 10, kind: "run", label: "main" },
  ],
  join: [
    { lane: 0, a: 0, b: 2, kind: "run", label: ["start, start", "start, start"] },
    { lane: 0, a: 2, b: 8.4, kind: "wait", label: ["T1.join(); T2.join(): main waits", "T1.join(); T2.join() : main attend"] },
    { lane: 0, a: 8.4, b: 10, kind: "run", label: ["fin de main", "fin de main"] },
    { lane: 1, a: 1, b: 7, kind: "run", label: "T1.run()" },
    { lane: 2, a: 1.6, b: 8.4, kind: "run", label: "T2.run()" },
  ],
};
var SCRIPTS = {
  mutex: { title: ["Mutex: s = 1", "Mutex : s = 1"], inside: ["In the critical section", "En section critique"], queue: ["Waiting queue (FIFO)", "File d'attente (FIFO)"], steps: [
    { op: "Semaphore s = new Semaphore(1, true);", vars: [["s", "1"]], inside: [], queue: [], note: ["1 = the resource is free (mutex).", "1 = la ressource est libre (mutex)."] },
    { op: "T1: s.acquire();   // P(s)", vars: [["s", "0"]], inside: ["T1"], queue: [], note: ["s > 0, so s := s − 1 and T1 enters its critical section.", "s > 0, donc s := s − 1 et T1 entre en section critique."] },
    { op: "T2: s.acquire();", vars: [["s", "0"]], inside: ["T1"], queue: ["T2"], note: ["s = 0: T2 is blocked in the queue (a blocked thread uses no CPU).", "s = 0 : T2 est bloqué dans la file (un thread bloqué n'utilise pas le CPU)."] },
    { op: "T3: s.acquire();", vars: [["s", "0"]], inside: ["T1"], queue: ["T2", "T3"], note: ["T3 queues behind T2.", "T3 se place derrière T2."] },
    { op: "T1: s.release();   // V(s)", vars: [["s", "0"]], inside: ["T2"], queue: ["T3"], note: ["V adds 1 and the first waiter continues: T2 takes that permit, so s is 0 again.", "V ajoute 1 et le premier en attente continue : T2 prend ce jeton, s revient à 0."] },
    { op: "T2: s.release();", vars: [["s", "0"]], inside: ["T3"], queue: [], note: ["Same: T3 goes in.", "Pareil : T3 entre."] },
    { op: "T3: s.release();", vars: [["s", "1"]], inside: [], queue: [], note: ["Nobody waits: the permit is remembered, s = 1. A semaphore counts.", "Personne n'attend : le jeton est mémorisé, s = 1. Un sémaphore compte."] },
  ] },
  order: { title: ["Ordering: s = 0", "Ordre : s = 0"], inside: ["Running after the signal", "S'exécute après le signal"], queue: ["Waiting", "En attente"], steps: [
    { op: "Semaphore s = new Semaphore(0);", vars: [["s", "0"]], inside: [], queue: [], note: ["0 = \"wait until someone signals\".", "0 = « attendre un signal »."] },
    { op: "B: s.acquire();", vars: [["s", "0"]], inside: [], queue: ["B"], note: ["B arrives first: it must wait for A.", "B arrive en premier : il doit attendre A."] },
    { op: "A: (action A); s.release();", vars: [["s", "0"]], inside: ["B"], queue: [], note: ["A is done; V lets B continue, so B runs after A.", "A a fini ; V laisse B continuer : B s'exécute après A."] },
    { op: "A: (action A); s.release();   // A first / A d'abord", vars: [["s", "1"]], inside: [], queue: [], note: ["If A finishes first, the signal is remembered: s = 1.", "Si A finit d'abord, le signal est mémorisé : s = 1."] },
    { op: "B: s.acquire();", vars: [["s", "0"]], inside: ["B"], queue: [], note: ["B passes at once. Either way, B runs after A.", "B passe tout de suite. Dans les deux cas, B s'exécute après A."] },
  ] },
  bridge: { title: ["Bridge: charge = 3 (fair)", "Pont : charge = 3 (équitable)"], inside: ["On the bridge", "Sur le pont"], queue: ["Waiting (FIFO)", "En attente (FIFO)"], steps: [
    { op: "charge = new Semaphore(3, true);   // 15 t = 3 units of 5 t", vars: [["charge", "3"], ["nb", "0"]], inside: [], queue: [], note: ["3 units of 5 t are free.", "3 unités de 5 t sont libres."] },
    { op: "Voiture1: charge.acquire(1);", vars: [["charge", "2"], ["nb", "1"]], inside: ["Voiture1"], queue: [], note: ["A car takes 1 unit; nb++ under the mutex.", "Une voiture prend 1 unité ; nb++ sous le mutex."] },
    { op: "Camion1: charge.acquire(3);", vars: [["charge", "2"], ["nb", "1"]], inside: ["Voiture1"], queue: ["Camion1"], note: ["Only 2 units free: the truck waits and takes nothing (all-or-nothing).", "Seulement 2 unités libres : le camion attend et ne prend rien (tout ou rien)."] },
    { op: "Voiture2: charge.acquire(1);", vars: [["charge", "2"], ["nb", "1"]], inside: ["Voiture1"], queue: ["Camion1", "Voiture2"], note: ["fair = true (FIFO): Voiture2 queues behind the truck instead of overtaking it, so trucks are not starved.", "fair = true (FIFO) : Voiture2 se place derrière le camion au lieu de le doubler, les camions ne sont pas affamés."] },
    { op: "Voiture1: charge.release(1);", vars: [["charge", "0"], ["nb", "1"]], inside: ["Camion1"], queue: ["Voiture2"], note: ["3 units free: the truck takes all 3.", "3 unités libres : le camion prend les 3."] },
    { op: "Camion1: charge.release(3);", vars: [["charge", "2"], ["nb", "1"]], inside: ["Voiture2"], queue: [], note: ["The truck leaves: Voiture2 takes 1 unit, 2 stay free.", "Le camion sort : Voiture2 prend 1 unité, 2 restent libres."] },
  ] },
  bakery: { title: ["Bakery basket", "Panier de la boulangerie"], inside: ["Seller being served", "Vendeur servi"], queue: ["Waiting sellers", "Vendeurs en attente"], items: ["Basket", "Panier"], steps: [
    { op: "baguettes = 0; mutex = new Semaphore(1, true); dispo = new Semaphore(0, true);", vars: [["dispo", "0"], ["mutex", "1"], ["baguettes", "0"]], inside: [], queue: [], items: 0, note: ["The basket starts empty: dispo counts the baguettes available.", "Le panier est vide au départ : dispo compte les baguettes disponibles."] },
    { op: "Vendeur1 (k = 2): dispo.acquire(2);", vars: [["dispo", "0"], ["mutex", "1"], ["baguettes", "0"]], inside: [], queue: ["Vendeur1 (2)"], items: 0, note: ["Empty basket: the seller waits on dispo, without holding the mutex.", "Panier vide : le vendeur attend sur dispo, sans tenir le mutex."] },
    { op: "Boulanger1: mutex.acquire(); baguettes++; mutex.release(); dispo.release();", vars: [["dispo", "1"], ["mutex", "1"], ["baguettes", "1"]], inside: [], queue: ["Vendeur1 (2)"], items: 1, note: ["1 baguette available, fewer than 2: Vendeur1 keeps waiting.", "1 baguette disponible, moins de 2 : Vendeur1 attend toujours."] },
    { op: "Boulanger2: mutex.acquire(); baguettes++; mutex.release(); dispo.release();", vars: [["dispo", "0"], ["mutex", "1"], ["baguettes", "2"]], inside: ["Vendeur1 (2)"], queue: [], items: 2, note: ["dispo reaches 2: acquire(2) succeeds and takes both permits at once.", "dispo atteint 2 : acquire(2) réussit et prend les 2 jetons d'un coup."] },
    { op: "Vendeur1: mutex.acquire(); baguettes -= 2; mutex.release();", vars: [["dispo", "0"], ["mutex", "1"], ["baguettes", "0"]], inside: [], queue: [], items: 0, note: ["The basket is changed only inside the mutex, and nobody blocks while holding it.", "Le panier n'est modifié que sous le mutex, et personne ne se bloque en le tenant."] },
  ] },
  bag: { title: ["Baggage room monitor", "Moniteur salle de bagages"], inside: ["In the room", "Dans la salle"], queue: ["On the chairs: salleVide", "Sur les chaises : salleVide"], steps: [
    { op: "MoniteurSalle: occupee = false; enAttente = 0; CHAISES = 5;", vars: [["occupee", "false"], ["enAttente", "0"]], inside: [], queue: [], note: ["One lock, one condition (salleVide).", "Un verrou, une condition (salleVide)."] },
    { op: "Voyageur1: entrer()", vars: [["occupee", "true"], ["enAttente", "0"]], inside: ["Voyageur1"], queue: [], note: ["Room free: occupee = true, prints that he drops his bag and writes his name.", "Salle libre : occupee = true, affiche qu'il dépose son bagage et écrit son nom."] },
    { op: "Voyageur2 … Voyageur6: entrer()", vars: [["occupee", "true"], ["enAttente", "5"]], inside: ["Voyageur1"], queue: ["V2", "V3", "V4", "V5", "V6"], note: ["Room busy, a chair is free: enAttente++, prints \"attend\", then while (occupee) salleVide.await(), which releases the lock.", "Salle occupée, une chaise libre : enAttente++, affiche « attend », puis while (occupee) salleVide.await(), qui libère le verrou."] },
    { op: "Voyageur7, Voyageur8: entrer()", vars: [["occupee", "true"], ["enAttente", "5"]], inside: ["Voyageur1"], queue: ["V2", "V3", "V4", "V5", "V6"], note: ["enAttente == CHAISES: each prints \"part vers une autre salle\" and returns false.", "enAttente == CHAISES : chacun affiche « part vers une autre salle » et renvoie false."] },
    { op: "Voyageur1: sortir()", vars: [["occupee", "true"], ["enAttente", "4"]], inside: ["V2"], queue: ["V3", "V4", "V5", "V6"], note: ["occupee = false, prints \"sort\", salleVide.signal() wakes the first waiter. V2 re-checks while (occupee), does enAttente--, then takes the room.", "occupee = false, affiche « sort », salleVide.signal() réveille le premier. V2 revérifie while (occupee), fait enAttente--, puis prend la salle."] },
  ] },
};
var TRACE = [
  ["0", "", "", "false", "false", "0"],
  ["1", "(section non critique)", "flag[1] = true", "false", "true", "0"],
  ["2", "", "token != 1 : 0 ≠ 1 → true", "false", "true", "0"],
  ["3", "", "flag[0] == true : false → sort du while interne", "false", "true", "0"],
  ["4", "flag[0] = true", "(préempté)", "true", "true", "0"],
  ["5", "token != 0 : false → saute la boucle", "", "true", "true", "0"],
  ["6", "entre en SC", "", "true", "true", "0"],
  ["7", "(en SC)", "token = 1", "true", "true", "1"],
  ["8", "(en SC)", "token != 1 : false → sort du while externe", "true", "true", "1"],
  ["9", "(en SC)", "entre en SC", "true", "true", "1"],
  ["10–11", "P0 et P1 en SC : sûreté violée", "", "", "", ""],
];
var PATTERNS = [
  { title: ["Thread skeleton + main", "Squelette de thread + main"], when: ["Every answer starts here: extends Thread, super(nom), getName(), start then join.", "Toute réponse commence ici : extends Thread, super(nom), getName(), start puis join."], code: `import java.util.concurrent.Semaphore;

class Client extends Thread {
    Client(String nom) { super(nom); }
    public void run() {
        try {
            // ... getName() ...
        } catch (InterruptedException e) {}
    }
}
public class Main {
    public static void main(String[] args) throws InterruptedException {
        Client[] c = new Client[5];
        for (int i = 0; i < 5; i++) { c[i] = new Client("Client" + (i + 1)); c[i].start(); }
        for (Client x : c) x.join();
    }
}` },
  { title: ["Mutex (init 1)", "Mutex (init 1)"], when: ["One shared resource or one shared counter. Test AND update inside.", "Une ressource ou un compteur partagé. Le test ET la mise à jour à l'intérieur."], code: `static Semaphore mutex = new Semaphore(1, true);

mutex.acquire();                 // protocole d'entrée
if (nb_places > 0) {             // section critique
    nb_places = nb_places - 1;
} else {
    System.out.println(getName() + " : plus de places.");
}
mutex.release();                 // protocole de sortie` },
  { title: ["Counting semaphore with acquire(n)", "Sémaphore compteur avec acquire(n)"], when: ["k identical units (bridge tonnes, packets on a board). acquire(n) is all-or-nothing.", "k unités identiques (tonnes du pont, paquets sur la planche). acquire(n) est tout ou rien."], code: `static Semaphore charge = new Semaphore(3, true); // 15 t = 3 x 5 t
static Semaphore mutex  = new Semaphore(1);       // protects nb
static int nb = 0;

charge.acquire(unites);          // car 1, truck 3
mutex.acquire(); nb++;
System.out.println(getName() + " passe. Sur le pont : " + nb);
mutex.release();
Thread.sleep(100);               // crossing
mutex.acquire(); nb--; mutex.release();
charge.release(unites);` },
  { title: ["Ordering: A then B (init 0)", "Ordre : A puis B (init 0)"], when: ["\"B must wait for A\". 0 means wait for a signal.", "« B doit attendre A ». 0 = attendre un signal."], code: `static Semaphore s = new Semaphore(0);

// thread A
// ... action A ...
s.release();

// thread B
s.acquire();
// ... action B ...` },
  { title: ["Token ring (DS Ex1 Q1)", "Anneau à jeton (DS Ex1 Q1)"], when: ["Fixed cyclic order A1 A2 A3: one token, passed on.", "Ordre cyclique fixe A1 A2 A3 : un seul jeton, passé de main en main."], code: `static Semaphore s1 = new Semaphore(1), s2 = new Semaphore(0), s3 = new Semaphore(0);

// P1: s1.acquire(); System.out.println("A1"); s2.release();
// P2: s2.acquire(); System.out.println("A2"); s3.release();
// P3: s3.acquire(); System.out.println("A3"); s1.release();` },
  { title: ["Group first-in / last-out", "Groupe : premier entré / dernier sorti"], when: ["Limit the number of GROUPS present (2 of 3 employee types), not people.", "Limiter le nombre de GROUPES présents (2 types d'employés sur 3), pas de personnes."], code: `static Semaphore types = new Semaphore(2, true);
static Semaphore[] mutexType = { new Semaphore(1), new Semaphore(1), new Semaphore(1) };
static int[] nb = {0, 0, 0};

// entry
mutexType[type].acquire();
nb[type]++;
if (nb[type] == 1) types.acquire();   // first of my type
mutexType[type].release();
// ... work ...
// exit
mutexType[type].acquire();
nb[type]--;
if (nb[type] == 0) types.release();   // last of my type
mutexType[type].release();` },
  { title: ["Producer / consumer (bakery)", "Producteur / consommateur (boulangerie)"], when: ["Producers add, consumers take k at a time. Never block while holding the mutex.", "Les producteurs ajoutent, les consommateurs prennent k à la fois. Ne jamais se bloquer en tenant le mutex."], code: `static int baguettes = 0;
static Semaphore mutex = new Semaphore(1, true);
static Semaphore dispo = new Semaphore(0, true);

// Boulanger
mutex.acquire(); baguettes++; mutex.release();
dispo.release();

// Vendeur (k baguettes)
dispo.acquire(k);                // OUTSIDE the mutex
mutex.acquire(); baguettes -= k; mutex.release();` },
  { title: ["Monitor: while + await, signal", "Moniteur : while + await, signal"], when: ["Waiting room, barber, baggage room: wait for a condition, wake the next one.", "Salle d'attente, barbier, salle de bagages : attendre une condition, réveiller le suivant."], code: `import java.util.concurrent.locks.*;

private final Lock lock = new ReentrantLock(true);
private final Condition salleVide = lock.newCondition();
private boolean occupee = false;

public void entrer() throws InterruptedException {
    lock.lock();
    try {
        while (occupee) salleVide.await();   // while, not if
        occupee = true;
    } finally { lock.unlock(); }
}
public void sortir() {
    lock.lock();
    try {
        occupee = false;
        salleVide.signal();                  // signalAll() if several may fit
    } finally { lock.unlock(); }
}` },
  { title: ["Unlock in finally", "unlock dans finally"], when: ["Every lock() is followed by try { … } finally { unlock(); }, even with a return inside.", "Chaque lock() est suivi de try { … } finally { unlock(); }, même avec un return dedans."], code: `lock.lock();
try {
    if (enAttente == CHAISES) {
        System.out.println(nom + " part vers une autre salle de bagages");
        return false;                 // finally still runs
    }
    // ...
    return true;
} finally {
    lock.unlock();
}` },
];
var EXS = [
  { id: "cs1", paper: "DS 2024 « Révision » (CS), 1h · Ex1 Q1", title: ["Never simultaneous [3 semaphores]", "Jamais simultanées [3 sémaphores]"],
    fr: "Soient les 3 processus suivants : (voir le code). Proposez un schéma de synchronisation de ces trois processus en utilisant des sémaphores dans chacun des cas suivants (N. B. Déclarez clairement vos sémaphores et précisez leurs valeurs initiales)\n1) Les actions Ai ne doivent jamais être simultanées. [3 sémaphores]",
    en: "Given the 3 processes below, propose a synchronisation scheme using semaphores for each case (declare your semaphores clearly and give their initial values).\n1) The actions Ai must never be simultaneous. [3 semaphores]",
    given: "class P1 extends Thread        class P2 extends Thread        class P3 extends Thread\npublic void run()              public void run()              public void run()\n{                              {                              {\nSystem.out.println('A1');      System.out.println('A2');      System.out.println('A3');\n}                              }                              }",
    hint: ["3 semaphores imposed: make a token ring. Only one semaphore starts at 1.", "3 sémaphores imposés : faites un anneau à jeton. Un seul sémaphore commence à 1."],
    plan: [["s1", "1", ["P1 may start", "P1 peut commencer"]], ["s2", "0", ["P2 waits for A1", "P2 attend A1"]], ["s3", "0", ["P3 waits for A2", "P3 attend A2"]]],
    planNote: ["Pi: si.acquire(); Ai; s(i+1).release(); (P3 releases s1). Output: A1 A2 A3. A single mutex(1) would also forbid simultaneity, but the paper asks for 3.", "Pi : si.acquire(); Ai; s(i+1).release(); (P3 libère s1). Sortie : A1 A2 A3. Un seul mutex(1) interdirait aussi la simultanéité, mais le sujet en demande 3."],
    code: `import java.util.concurrent.Semaphore;

class P1 extends Thread {
    public void run() {
        try {
            Principale.s1.acquire();
            System.out.println("A1");     // the paper writes 'A1': use double quotes
            Principale.s2.release();
        } catch (InterruptedException e) {}
    }
}
class P2 extends Thread {
    public void run() {
        try {
            Principale.s2.acquire();
            System.out.println("A2");
            Principale.s3.release();
        } catch (InterruptedException e) {}
    }
}
class P3 extends Thread {
    public void run() {
        try {
            Principale.s3.acquire();
            System.out.println("A3");
            Principale.s1.release();
        } catch (InterruptedException e) {}
    }
}
// Déclaration des sémaphores
class Principale {
    static Semaphore s1 = new Semaphore(1);
    static Semaphore s2 = new Semaphore(0);
    static Semaphore s3 = new Semaphore(0);
}`,
    check: [["Initial values written next to each semaphore.", "Valeurs initiales écrites à côté de chaque sémaphore."], ["try/catch (InterruptedException) around acquire.", "try/catch (InterruptedException) autour de acquire."], ["\"A1\" in double quotes (the paper's 'A1' is not valid Java).", "\"A1\" entre guillemets doubles ('A1' du sujet n'est pas du Java valide)."]] },
  { id: "cs2", paper: "DS 2024 « Révision » (CS), 1h · Ex1 Q2", title: ["Order A1 (A2 or A3) A1 … [2 semaphores]", "Ordre A1 (A2 ou A3) A1 … [2 sémaphores]"],
    fr: "2) Les actions Ai ne doivent jamais être simultanées et doivent se dérouler toujours dans l'ordre A1(A2 ou A3)A1(A2 ou A3)... [2 sémaphores]",
    en: "2) The actions Ai must never be simultaneous and must always happen in the order A1 (A2 or A3) A1 (A2 or A3)… [2 semaphores]",
    hint: ["A1 alternates with \"one of A2/A3\". One semaphore for A1's turn, one shared by P2 and P3.", "A1 alterne avec « une de A2/A3 ». Un sémaphore pour le tour de A1, un partagé par P2 et P3."],
    plan: [["sA1", "1", ["A1 goes first", "A1 passe en premier"]], ["sA23", "0", ["A2/A3 wait for an A1; one release = one of them", "A2/A3 attendent un A1 ; un release = une seule des deux"]]],
    planNote: ["The sequence repeats, so loop with while (true). Example output: A1 A2 A1 A3 A1 A3 …", "La suite se répète : boucle while (true). Exemple de sortie : A1 A2 A1 A3 A1 A3 …"],
    code: `class P1 extends Thread {
    public void run() {
        try {
            while (true) {
                Principale.sA1.acquire();
                System.out.println("A1");
                Principale.sA23.release();
            }
        } catch (InterruptedException e) {}
    }
}
class P2 extends Thread {            // P3 is identical with "A3"
    public void run() {
        try {
            while (true) {
                Principale.sA23.acquire();
                System.out.println("A2");
                Principale.sA1.release();
            }
        } catch (InterruptedException e) {}
    }
}
// Déclaration des sémaphores
class Principale {
    static Semaphore sA1  = new Semaphore(1);
    static Semaphore sA23 = new Semaphore(0);
}` },
  { id: "cs3", paper: "DS 2024 « Révision » (CS), 1h · Ex2", title: ["The 15-tonne bridge", "Le pont de 15 tonnes"],
    fr: "Un pont supporte une charge maximale de 15 tonnes. Ce pont est traversé par des camions dont le poids est de 15 tonnes ainsi que par des voitures dont le poids est de 5 tonnes. On vous demande de gérer l'accès au pont de sorte que la charge maximale du pont soit respectée.\nEn passant chaque automobile, affiche son nom.\nCalculer et afficher le nombre total d'automobiles (voitures et camions) à un instant t sur le pont.\nDonnez une solution Java à ce problème en utilisant les sémaphores.(toutes les classes)",
    en: "A bridge holds at most 15 tonnes. Trucks (15 t) and cars (5 t) cross it. Manage access so the maximum load is respected.\nEach vehicle prints its name when it crosses.\nCompute and print the total number of vehicles (cars and trucks) on the bridge at time t.\nGive a Java solution with semaphores (all the classes).",
    hint: ["Count the capacity in 5 t units: 3 units. A car takes 1, a truck 3, in ONE acquire. nb needs its own mutex.", "Comptez la capacité en unités de 5 t : 3 unités. Une voiture en prend 1, un camion 3, en UN SEUL acquire. nb a besoin de son propre mutex."],
    plan: [["charge", "3 (fair)", ["5 t units on the bridge; FIFO so trucks are not starved", "unités de 5 t sur le pont ; FIFO pour ne pas affamer les camions"]], ["mutex", "1", ["protects nb", "protège nb"]], ["nb (int)", "0", ["vehicles on the bridge at time t", "véhicules sur le pont à l'instant t"]]],
    planNote: ["Also valid: Semaphore(15) with acquire(5) / acquire(15). Never 3 × acquire() for a truck (deadlock risk).", "Aussi valable : Semaphore(15) avec acquire(5) / acquire(15). Jamais 3 × acquire() pour un camion (risque d'interblocage)."],
    code: `import java.util.concurrent.Semaphore;

class PontPartage {
    static Semaphore charge = new Semaphore(3, true);   // 15 t = 3 units of 5 t
    static Semaphore mutex  = new Semaphore(1);         // protects nb
    static int nb = 0;
}
class Vehicule extends Thread {
    int unites;                                         // car 1, truck 3
    Vehicule(String nom, int unites) { super(nom); this.unites = unites; }
    public void run() {
        try {
            PontPartage.charge.acquire(unites);
            PontPartage.mutex.acquire();
            PontPartage.nb++;
            System.out.println(getName() + " passe sur le pont. Véhicules sur le pont : " + PontPartage.nb);
            PontPartage.mutex.release();
            Thread.sleep(100);                          // crossing
            PontPartage.mutex.acquire();
            PontPartage.nb--;
            System.out.println(getName() + " quitte le pont. Véhicules sur le pont : " + PontPartage.nb);
            PontPartage.mutex.release();
            PontPartage.charge.release(unites);
        } catch (InterruptedException e) {}
    }
}
class Voiture extends Vehicule { Voiture(String nom) { super(nom, 1); } }
class Camion  extends Vehicule { Camion(String nom)  { super(nom, 3); } }

public class Pont {
    public static void main(String[] args) throws InterruptedException {
        Vehicule[] v = { new Voiture("Voiture1"), new Camion("Camion1"), new Voiture("Voiture2"),
                         new Voiture("Voiture3"), new Voiture("Voiture4"), new Camion("Camion2") };
        for (Vehicule x : v) x.start();
        for (Vehicule x : v) x.join();
    }
}`,
    check: [["All classes given (the paper says \"toutes les classes\").", "Toutes les classes données (« toutes les classes »)."], ["Name printed on crossing, nb printed.", "Nom affiché au passage, nb affiché."], ["release(unites) when leaving.", "release(unites) à la sortie."]] },
  { id: "cs3v", paper: ["Tutor variant of DS 2024 Ex2 (not on the paper)", "Variante du tuteur du DS 2024 Ex2 (pas dans le sujet)"], title: ["Bridge: at most N vehicles", "Pont : au plus N véhicules"],
    fr: "(Variante d'entraînement du tuteur, ne figure pas dans le sujet.) Plus de limite de poids, mais au plus N véhicules à la fois sur le pont.",
    en: "(Tutor practice variant, not on the paper.) No weight limit any more, but at most N vehicles on the bridge at once.",
    hint: ["Each vehicle counts as one place, whatever its weight.", "Chaque véhicule compte pour une place, quel que soit son poids."],
    plan: [["places", "N (fair)", ["one permit per vehicle", "un jeton par véhicule"]], ["mutex", "1", ["protects nb", "protège nb"]]],
    code: `class VehiculeN extends Thread {
    static final int N = 2;
    static Semaphore places = new Semaphore(N, true);
    static Semaphore mutex  = new Semaphore(1);
    static int nb = 0;
    VehiculeN(String nom) { super(nom); }
    public void run() {
        try {
            places.acquire();                  // ONE place, whatever the weight
            mutex.acquire(); nb++;
            System.out.println(getName() + " passe. Sur le pont : " + nb);
            mutex.release();
            Thread.sleep(100);
            mutex.acquire(); nb--;
            System.out.println(getName() + " sort. Sur le pont : " + nb);
            mutex.release();
            places.release();
        } catch (InterruptedException e) {}
    }
}` },
  { id: "g1", paper: "DS 04/11/2024 (GLID), 1h30 · Ex1 Q1", title: ["Shared work board + total time", "Planche partagée + temps total"],
    fr: "On se propose de réaliser un programme qui permet aux employés de partager une planche de travail, et de calculer le temps total d'utilisation de la planche. A un instant donnée, un seul employé peut accéder à la planche. t_utilisation est le temps total d'utilisation de la planche de travail par tous les employés. Après l'utilisation et avant la libération de la planche, l'employé récupère le temps d'utilisation de la planche et met à jour t_utilisation. En travaillant chaque employé, affiche son nom, ainsi que le temps total d'utilisation de la planche.\n1/ Donnez une solution Java à ce problème en utilisant les sémaphores. (Toutes les classes). NB : Utiliser la méthode prédéfinie getCurrentTimes() qui retourne le temps courant (sans donner son code).",
    en: "Employees share one work board, and we compute its total usage time. Only one employee can use the board at a time. t_utilisation is the total usage time by all employees. After using the board and before releasing it, the employee gets his usage time and updates t_utilisation. While working, each employee prints his name and the total usage time.\n1/ Give a Java solution with semaphores (all the classes). Use the predefined method getCurrentTimes(), which returns the current time (do not write its code).",
    hint: ["One board = one mutex. The update happens before release, so the same semaphore protects t_utilisation.", "Une planche = un mutex. La mise à jour a lieu avant le release : le même sémaphore protège t_utilisation."],
    plan: [["planche", "1 (fair)", ["one employee at a time; also protects t_utilisation", "un employé à la fois ; protège aussi t_utilisation"]], ["t_utilisation (long)", "0", ["shared total", "total partagé"]]],
    code: `import java.util.concurrent.Semaphore;

class Principale {
    static Semaphore planche = new Semaphore(1, true);
    static long t_utilisation = 0;
}
class Employe extends Thread {
    Employe(String nom) { super(nom); }
    public void run() {
        try {
            Principale.planche.acquire();
            long debut = getCurrentTimes();        // predefined, do not write it
            System.out.println(getName() + " travaille sur la planche");
            Thread.sleep(50);                      // work
            long fin = getCurrentTimes();
            Principale.t_utilisation += fin - debut;   // before release
            System.out.println(getName() + " : temps total = " + Principale.t_utilisation);
            Principale.planche.release();
        } catch (InterruptedException e) {}
    }
}
// main: create the employees, start(), join().` },
  { id: "g2", paper: "DS 04/11/2024 (GLID), 1h30 · Ex1 Q2", title: ["Only 2 employee types out of 3", "Seulement 2 types d'employés sur 3"],
    fr: "2/ Supposons maintenant que nous avons trois types d'employés selon le poids des paquets traités : Employé_leger (paquets de 5 Cm), Employé_lourd (20 Cm), Employé_Moy (10 Cm). Cependant, la planche de travail ne peut supporter que la présence de deux types d'employés parmi les trois. En travaillant chaque employé, affiche son type ainsi que le nombre de paquets déposés. Donnez en java le code des classes Threads. Donnez aussi la partie déclaration des sémaphores de la classe principale (sans donner le code de lancement des threads).",
    en: "2/ Now there are three employee types by packet weight: Employé_leger (5 cm packets), Employé_lourd (20 cm), Employé_Moy (10 cm). The board can only hold employees of two of the three types at once. While working, each employee prints his type and the number of packets deposited. Give the Java code of the Thread classes and the semaphore declarations of the main class (not the code that launches the threads).",
    hint: ["Limit TYPES, not people: the first employee of a type takes a type slot, the last one of that type to leave gives it back.", "On limite les TYPES, pas les personnes : le premier employé d'un type prend une place de type, le dernier de ce type à partir la rend."],
    plan: [["types", "2 (fair)", ["type slots on the board", "places de type sur la planche"]], ["mutexType[3]", "1, 1, 1", ["protect nb[type]", "protègent nb[type]"]], ["nb[3] (int)", "0, 0, 0", ["employees of each type present", "employés présents de chaque type"]], ["mutexP", "1", ["protects nbPaquets", "protège nbPaquets"]], ["nbPaquets (int)", "0", ["packets deposited", "paquets déposés"]]],
    planNote: ["Interpretation (tutor): \"nombre de paquets déposés\" = a running total protected by mutexP; each employee is created with its number of packets.", "Interprétation (tuteur) : « nombre de paquets déposés » = un total cumulé protégé par mutexP ; chaque employé est créé avec son nombre de paquets."],
    code: `// Déclaration (classe principale)
class Principale {
    static Semaphore types = new Semaphore(2, true);
    static Semaphore[] mutexType = { new Semaphore(1), new Semaphore(1), new Semaphore(1) };
    static int[] nb = {0, 0, 0};
    static Semaphore mutexP = new Semaphore(1);
    static int nbPaquets = 0;
}
abstract class EmployeT extends Thread {
    int type, paquets;
    EmployeT(String nom, int type, int paquets) { super(nom); this.type = type; this.paquets = paquets; }
    abstract String nomType();
    public void run() {
        try {
            Principale.mutexType[type].acquire();
            Principale.nb[type]++;
            if (Principale.nb[type] == 1) Principale.types.acquire();   // first of my type
            Principale.mutexType[type].release();

            Principale.mutexP.acquire();
            Principale.nbPaquets += paquets;
            System.out.println(nomType() + " (" + getName() + ") dépose " + paquets + " paquet(s). Total : " + Principale.nbPaquets);
            Principale.mutexP.release();
            Thread.sleep(50);                                            // work

            Principale.mutexType[type].acquire();
            Principale.nb[type]--;
            if (Principale.nb[type] == 0) Principale.types.release();   // last of my type
            Principale.mutexType[type].release();
        } catch (InterruptedException e) {}
    }
}
class Employe_leger extends EmployeT { Employe_leger(String n, int p) { super(n, 0, p); } String nomType() { return "Employé_leger"; } }
class Employe_lourd extends EmployeT { Employe_lourd(String n, int p) { super(n, 1, p); } String nomType() { return "Employé_lourd"; } }
class Employe_Moy   extends EmployeT { Employe_Moy(String n, int p)   { super(n, 2, p); } String nomType() { return "Employé_Moy"; } }` },
  { id: "g3", paper: "DS 04/11/2024 (GLID), 1h30 · Ex1 Q3", title: ["Plus: at most N packets", "En plus : au plus N paquets"],
    fr: "3/ Supposons maintenant qu'à part la contrainte de nombre de types limité, la planche ne peut supporter qu'un nombre N de paquets à la fois. Ajouter avec une autre couleur sur votre réponse de la question 2 le code qui permet de supporter cette contrainte.",
    en: "3/ Now, besides the limited number of types, the board can only hold N packets at a time. Add, in another colour on your answer to question 2, the code that enforces this constraint.",
    hint: ["Same capacity pattern as the bridge: acquire(paquets) before depositing, release(paquets) when leaving.", "Même schéma de capacité que le pont : acquire(paquets) avant de déposer, release(paquets) en partant."],
    plan: [["placesPaquets", "N (fair)", ["packet places on the board", "places de paquets sur la planche"]]],
    code: `// added to Principale
static Semaphore placesPaquets = new Semaphore(N, true);

// in run(), after taking the type slot:
Principale.placesPaquets.acquire(paquets);      // all-or-nothing
// ... deposit + print (mutexP) ... work ...
Principale.mutexP.acquire();
Principale.nbPaquets -= paquets;                // packets taken away
Principale.mutexP.release();
Principale.placesPaquets.release(paquets);
// then the "last of my type" exit block` },
  { id: "g4", paper: "DS 04/11/2024 (GLID), 1h30 · Ex2", title: ["Airport baggage room (monitor)", "Salle de bagages d'aéroport (moniteur)"],
    fr: "On se propose de modéliser le fonctionnement au sein de la salle de bagages dans un aéroport. Le bagagiste accueille les voyageurs et reçoit leurs bagages pour dépôt dans la salle. A un instant t, le bagagiste ne peut recevoir qu'un seul voyageur. Le voyageur vérifie avant son entré que la salle est vide, sinon il attend devant la salle. Cependant, le nombre de chaises disponibles pour l'attente est égal à 5. S'il ne trouve pas de place pour attendre, il part vers une autre salle de bagages. Dès que le voyageur entre dans la salle, il place son bagage dans l'armoire, écrit son nom et sort. On se propose de modéliser le fonctionnement de la salle de bagages moyennant les moniteurs. Pour cela on vous demande d'écrire le code du moniteur et celui de la classe Thread Voyageur. Afficher à chaque étape, si le voyageur dépose le bagage, sort, attend ou part.",
    en: "Model an airport baggage room. The porter welcomes travellers and takes their bags into the room. At time t he can receive only one traveller. Before entering, a traveller checks the room is empty; otherwise he waits in front of it. There are 5 chairs for waiting. If no chair is free, he leaves for another baggage room. Once inside, he puts his bag in the cupboard, writes his name and leaves. Model this with monitors: write the monitor and the Thread class Voyageur. At each step print whether the traveller drops his bag, leaves the room, waits or goes away.",
    hint: ["Barber-style waiting room: test the chairs BEFORE waiting, await in a while, signal on exit, unlock in finally.", "Salle d'attente type barbier : tester les chaises AVANT d'attendre, await dans un while, signal à la sortie, unlock dans finally."],
    plan: [["lock", "ReentrantLock(true)", ["the monitor", "le moniteur"]], ["salleVide", "lock.newCondition()", ["travellers on the chairs", "voyageurs sur les chaises"]], ["occupee", "false", ["porter busy with a traveller", "bagagiste occupé"]], ["enAttente", "0", ["chairs taken", "chaises occupées"]], ["CHAISES", "5", ["constant", "constante"]]],
    code: `import java.util.concurrent.locks.*;

class MoniteurSalle {
    private final Lock lock = new ReentrantLock(true);
    private final Condition salleVide = lock.newCondition();
    private boolean occupee = false;
    private int enAttente = 0;
    private static final int CHAISES = 5;

    public boolean entrer(String nom) throws InterruptedException {
        lock.lock();
        try {
            if (occupee) {
                if (enAttente == CHAISES) {
                    System.out.println(nom + " part vers une autre salle de bagages");
                    return false;
                }
                enAttente++;
                System.out.println(nom + " attend devant la salle");
                while (occupee) salleVide.await();
                enAttente--;
            }
            occupee = true;
            System.out.println(nom + " dépose son bagage dans l'armoire et écrit son nom");
            return true;
        } finally { lock.unlock(); }
    }
    public void sortir(String nom) {
        lock.lock();
        try {
            occupee = false;
            System.out.println(nom + " sort de la salle");
            salleVide.signal();
        } finally { lock.unlock(); }
    }
}
class Voyageur extends Thread {
    private final MoniteurSalle salle;
    Voyageur(String nom, MoniteurSalle salle) { super(nom); this.salle = salle; }
    public void run() {
        try {
            if (salle.entrer(getName())) {
                Thread.sleep(40);          // drops the bag
                salle.sortir(getName());
            }
        } catch (InterruptedException e) {}
    }
}`,
    check: [["Chairs test made before waiting.", "Test des chaises fait avant d'attendre."], ["await inside a while.", "await dans un while."], ["unlock in finally.", "unlock dans finally."], ["All four prints: dépose / sort / attend / part.", "Les quatre affichages : dépose / sort / attend / part."]] },
  { id: "t1", paper: "TD1 · Ex1", title: ["Prove the algorithm wrong (trace)", "Montrer que l'algorithme est faux (trace)"],
    fr: "On considère un programme parallèle contenant deux processus P0 et P1 utilisant les trois variables globales : flag[0] : boolean, flag[1] : boolean, token : 0..1, initialisées respectivement à false, false, 0. Montrez, en donnant une exécution (à chaque instant, un seul des processus effectue une action) possible de ce programme, que cette solution est fausse du fait qu'il est possible que les deux processus soient simultanément en section critique.",
    en: "A parallel program has two processes P0 and P1 sharing flag[0], flag[1] (booleans) and token (0..1), initialised to false, false, 0. Show, by giving a possible execution (one process acts at each instant), that this solution is wrong because both processes can be in the critical section at the same time.",
    given: "Pi (i = 0 or 1, j = the other):\nwhile (true) {\n    < section non critique >\n    flag[i] = true;\n    while (token != i) {\n        while (flag[j] == true) { }\n        token = i;\n    }\n    < section critique >\n    flag[i] = false;\n}",
    hint: ["Let P1 pass its inner test while flag[0] is still false, then pause it just before token = 1.", "Laissez P1 passer son test interne tant que flag[0] est false, puis suspendez-le juste avant token = 1."],
    plan: [["flag[0], flag[1]", "false, false", ["\"I want to enter\"", "« je veux entrer »"]], ["token", "0", ["whose turn it is", "à qui le tour"]]],
    planNote: ["Conclusion: testing flag[j] then writing token is not atomic (Hyman's algorithm). A semaphore fixes it.", "Conclusion : tester flag[j] puis écrire token n'est pas atomique (algorithme de Hyman). Un sémaphore règle le problème."],
    code: "", trace: true },
  { id: "t2", paper: "TD1 · Ex2", title: ["The bakery (producer / consumer)", "La boulangerie (producteur / consommateur)"],
    fr: "Nous traitons le fonctionnement d'une boulangerie. N boulangers préparent et déposent les baguettes dans un panier. M vendeurs retirent des baguettes pour servir les clients qui peuvent demander jusqu'à x baguettes à la fois.\nOn traite le problème d'exclusion mutuelle entre boulangers et vendeurs sur le panier, Donnez une solution Java à ce problème en utilisant les sémaphores.",
    en: "A bakery: N bakers make baguettes and put them in a basket. M sellers take baguettes out to serve customers, who can ask for up to x baguettes at a time.\nHandle mutual exclusion between bakers and sellers on the basket. Give a Java solution using semaphores.",
    hint: ["mutex for the basket, dispo counts available baguettes. Sellers wait on dispo.acquire(k) OUTSIDE the mutex.", "mutex pour le panier, dispo compte les baguettes disponibles. Les vendeurs attendent sur dispo.acquire(k) HORS du mutex."],
    plan: [["mutex", "1 (fair)", ["basket access", "accès au panier"]], ["dispo", "0 (fair)", ["baguettes available", "baguettes disponibles"]], ["baguettes (int)", "0", ["basket content", "contenu du panier"]]],
    planNote: ["Assumption (tutor): the basket has no capacity limit. If it had capacity C, add places = new Semaphore(C) taken by bakers.", "Hypothèse (tuteur) : le panier n'a pas de capacité limite. S'il avait une capacité C, ajouter places = new Semaphore(C) pris par les boulangers."],
    code: `import java.util.concurrent.Semaphore;

class Panier {
    static int baguettes = 0;
    static Semaphore mutex = new Semaphore(1, true);
    static Semaphore dispo = new Semaphore(0, true);
}
class Boulanger extends Thread {
    int aProduire;
    Boulanger(String nom, int aProduire) { super(nom); this.aProduire = aProduire; }
    public void run() {
        try {
            for (int i = 0; i < aProduire; i++) {
                Thread.sleep(20);                       // bake
                Panier.mutex.acquire();
                Panier.baguettes++;
                System.out.println(getName() + " dépose 1 baguette. Panier = " + Panier.baguettes);
                Panier.mutex.release();
                Panier.dispo.release();
            }
        } catch (InterruptedException e) {}
    }
}
class Vendeur extends Thread {
    int demande;                                        // 1 <= k <= x
    Vendeur(String nom, int demande) { super(nom); this.demande = demande; }
    public void run() {
        try {
            Panier.dispo.acquire(demande);              // outside the mutex
            Panier.mutex.acquire();
            Panier.baguettes -= demande;
            System.out.println(getName() + " retire " + demande + " baguette(s). Panier = " + Panier.baguettes);
            Panier.mutex.release();
        } catch (InterruptedException e) {}
    }
}
// main: create N Boulanger and M Vendeur, start(), join().` },
  { id: "t3", paper: "TD1 · Ex3", title: ["The cigarette smokers", "Les fumeurs de cigarettes"],
    fr: "On suppose qu'il ya 3 fumeurs de cigarettes (chacun est représenté par un processus) et un agent (aussi représenté par un processus). Chaque fumeur continuellement cherche à fabriquer une cigarette pour la fumer.\nFabriquer et fumer une cigarette exigent 3 ingrédients : du tabac, du papier et une allumette. Le premier fumeur possède seulement du tabac, le deuxième possède seulement du papier et le troisième a seulement des allumettes. Chacun dispose une quantité assez grande (illimitée) des ingrédients qu'il possède.\nA chaque itération l'agent place deux ingrédients aléatoires sur la table. Le fumeur qui a le troisième ingrédient prend les deux autres, il fabrique une cigarette, puis il la fume. L'agent attend le fumeur jusqu'à il termine cette cigarette. Et le cycle se répète.\nEn utilisant les sémaphores, donnez une solution au problème décrit ci-dessus qui assure le non blocage du système composé de l'agent et des 3 fumeurs.",
    en: "3 smokers and 1 agent are processes. Making and smoking a cigarette needs tobacco, paper and a match. Smoker 1 has only tobacco, smoker 2 only paper, smoker 3 only matches, in unlimited amounts.\nEach round the agent puts two random ingredients on the table. The smoker with the third ingredient takes them, makes a cigarette and smokes it. The agent waits until he has finished, then the cycle repeats.\nUsing semaphores, give a solution that guarantees the agent + 3 smokers system never blocks.",
    hint: ["Naïve version: one semaphore per ingredient; two smokers can each grab one ingredient and both wait (deadlock). Fix: the agent picks the smoker and wakes only him.", "Version naïve : un sémaphore par ingrédient ; deux fumeurs prennent chacun un ingrédient et attendent (interblocage). Correction : l'agent choisit le fumeur et ne réveille que lui."],
    plan: [["agent", "1", ["the table is free, the agent may serve", "la table est libre, l'agent peut servir"]], ["fumeur[0..2]", "0, 0, 0", ["released when smoker i's two missing ingredients are on the table", "libéré quand les 2 ingrédients manquants du fumeur i sont sur la table"]]],
    code: `import java.util.concurrent.Semaphore;
import java.util.Random;

class Table {
    static Semaphore agent = new Semaphore(1);
    static Semaphore[] fumeur = { new Semaphore(0), new Semaphore(0), new Semaphore(0) };
    static String[] possede = { "tabac", "papier", "allumettes" };
}
class Agent extends Thread {
    public void run() {
        Random r = new Random();
        try {
            while (true) {
                Table.agent.acquire();          // wait until the previous smoker is done
                int i = r.nextInt(3);           // the 2 ingredients smoker i lacks
                System.out.println("Agent pose les 2 ingrédients qui manquent au fumeur qui a " + Table.possede[i]);
                Table.fumeur[i].release();      // wake exactly that smoker
            }
        } catch (InterruptedException e) {}
    }
}
class Fumeur extends Thread {
    int i;
    Fumeur(int i) { this.i = i; }
    public void run() {
        try {
            while (true) {
                Table.fumeur[i].acquire();
                System.out.println("Fumeur (" + Table.possede[i] + ") roule et fume");
                Thread.sleep(30);
                Table.agent.release();          // tell the agent
            }
        } catch (InterruptedException e) {}
    }
}` },
  { id: "c1", paper: ["Cours Sémaphore · Exercice 1", "Cours Sémaphore · Exercice 1"], title: ["Plane seat booking", "Réservation de places d'avion"],
    fr: "Ecrire un programme Java qui accomplit la réservation des places dans un avion. La synchronisation entre les différents clients est réalisé à l'aide des sémaphores. Afficher à la fin du programme le nombre de places restants dans l'avion.",
    en: "Write a Java program that books seats on a plane. Synchronise the clients with semaphores. At the end, print the number of seats left.",
    hint: ["Test and decrement inside one mutex; join every client before printing the final count.", "Test et décrémentation dans un seul mutex ; join de chaque client avant d'afficher le reste."],
    plan: [["mutex", "1 (fair)", ["protects nb_places", "protège nb_places"]], ["nb_places (int)", "3", ["seats (example value)", "places (valeur d'exemple)"]]],
    planNote: ["With 3 seats and 5 clients: 3 book, 2 get \"plus de places\", final count 0.", "Avec 3 places et 5 clients : 3 réservent, 2 reçoivent « plus de places », reste final 0."],
    code: `import java.util.concurrent.Semaphore;

class Avion {
    static int nb_places = 3;
    static Semaphore mutex = new Semaphore(1, true);
}
class Client extends Thread {
    Client(String nom) { super(nom); }
    public void run() {
        try {
            Avion.mutex.acquire();
            if (Avion.nb_places > 0) {
                Avion.nb_places = Avion.nb_places - 1;
                System.out.println(getName() + " a réservé. Places restantes : " + Avion.nb_places);
            } else {
                System.out.println(getName() + " : plus de places.");
            }
            Avion.mutex.release();
        } catch (InterruptedException e) {}
    }
}
public class Reservation {
    public static void main(String[] args) throws InterruptedException {
        Client[] c = new Client[5];
        for (int i = 0; i < 5; i++) { c[i] = new Client("Client" + (i + 1)); c[i].start(); }
        for (Client x : c) x.join();
        System.out.println("Places restantes à la fin : " + Avion.nb_places);
    }
}` },
];
var CHEAT = [
    { h: "Threads", items: [["`class T extends Thread { T(String n) { super(n); } public void run() {…} }`", "`class T extends Thread { T(String n) { super(n); } public void run() {…} }`"], ["`implements Runnable` → `new Thread(obj).start()`", "`implements Runnable` → `new Thread(obj).start()`"], ["start() = new thread; run() = plain call; join() = wait for the end.", "start() = nouveau thread ; run() = simple appel ; join() = attendre la fin."], ["try/catch InterruptedException around sleep, join, acquire, await.", "try/catch InterruptedException autour de sleep, join, acquire, await."], ["nouveau → exécutable → en attente → mort.", "nouveau → exécutable → en attente → mort."]] },
    { h: ["Mutual exclusion", "Exclusion mutuelle"], items: [["SC = code touching shared data.", "SC = code qui touche les données partagées."], ["Entry protocol / SC / exit protocol.", "Protocole d'entrée / SC / protocole de sortie."], ["Sûreté: never 2 in SC. Vivacité: whoever asks enters.", "Sûreté : jamais 2 en SC. Vivacité : qui demande entre."], ["Robustesse: an outsider does not block.", "Robustesse : un processus extérieur ne bloque pas."], ["Test + update in the same SC.", "Test + mise à jour dans la même SC."]] },
    { h: ["Semaphores", "Sémaphores"], items: [["P: if s > 0 then s − 1 else wait. V: s + 1, wakes a waiter.", "P : si s > 0 alors s − 1 sinon attendre. V : s + 1, réveille un processus."], ["`new Semaphore(k, true)`: FIFO.", "`new Semaphore(k, true)` : FIFO."], "acquire() / acquire(n) / release() / release(n)", ["Init 1 mutex, 0 ordering, k counting.", "Init 1 mutex, 0 ordre, k compteur."], ["Never block while holding the mutex.", "Ne jamais se bloquer en tenant le mutex."]] },
    { h: ["Ordering schemes", "Schémas d'ordre"], items: [["A then B: s = 0; A … s.release(); B s.acquire() …", "A puis B : s = 0 ; A … s.release(); B s.acquire() …"], ["Token ring: s1 = 1, s2 = s3 = 0; Pi: si.acquire; Ai; s(i+1).release.", "Anneau : s1 = 1, s2 = s3 = 0 ; Pi : si.acquire ; Ai ; s(i+1).release."], ["A1 (A2|A3): sA1 = 1, sA23 = 0, while (true).", "A1 (A2|A3) : sA1 = 1, sA23 = 0, while (true)."], ["\"A1\" in double quotes.", "\"A1\" entre guillemets doubles."]] },
    { h: ["Story problems", "Problèmes « histoire »"], items: [["Bridge: charge = Semaphore(3, true); car acquire(1), truck acquire(3); mutex for nb.", "Pont : charge = Semaphore(3, true) ; voiture acquire(1), camion acquire(3) ; mutex pour nb."], ["N vehicles: places = Semaphore(N, true), acquire(1).", "N véhicules : places = Semaphore(N, true), acquire(1)."], ["Bakery: mutex = 1, dispo = 0; dispo.acquire(k) outside the mutex.", "Boulangerie : mutex = 1, dispo = 0 ; dispo.acquire(k) hors du mutex."], ["Groups: nb[g]++ == 1 → acquire; nb[g]-- == 0 → release.", "Groupes : nb[g]++ == 1 → acquire ; nb[g]-- == 0 → release."], ["Smokers: agent = 1, fumeur[i] = 0.", "Fumeurs : agent = 1, fumeur[i] = 0."]] },
    { h: ["Monitors", "Moniteurs"], items: ["`import java.util.concurrent.locks.*;`", "`Lock l = new ReentrantLock(true); Condition c = l.newCondition();`", "`l.lock(); try { while (!ok) c.await(); … c.signal(); } finally { l.unlock(); }`", ["signal with nobody waiting is lost; a semaphore remembers.", "un signal sans personne en attente est perdu ; un sémaphore mémorise."], ["Waiting room: chairs full → \"part\", return false; else enAttente++, \"attend\", while await.", "Salle d'attente : chaises pleines → « part », return false ; sinon enAttente++, « attend », while await."]] },
  ];  var tr = Study.tr, esc = Study.esc, rich = Study.rich, wseg = Study.wseg;
  function fr() { return Study.lang() === "fr"; }
  function L(b) { return tr(b); }
  function sec(h, b, cap) { return { t: "sec", h: h, cap: cap, b: b }; }
  function tbl(cols, rows, o) { var x = { t: "table", cols: cols, rows: rows }; if (o) for (var k in o) x[k] = o[k]; return x; }
  function P(x) { return { t: "p", x: x }; }
  function grid(b, cols) { return { t: "grid", cols: cols || 2, b: b }; }
  function code(x, title) { return { t: "code", x: x, lang: "java", title: title }; }
  function CO(tone, lead, x) { return { t: "callout", tone: tone, lead: lead, x: x }; }
  function DG(dir, nodes, edges, o) { var x = { t: "diagram", dir: dir, nodes: nodes, edges: edges }; if (o) for (var k in o) x[k] = o[k]; return x; }
  function W(w, o) { var x = { t: "widget", w: w }; if (o) for (var k in o) x[k] = o[k]; return x; }
  function cells(rows) { return rows.map(function (r) { return r.map(function (c) { return (c && typeof c === "object" && !Array.isArray(c)) ? { t: c.t, tone: c.tone } : c; }); }); }
  function stepBtns(key, val, i, n) {
    return '<div class="ctl">' + Study.btn(tr(["Previous step", "Étape précédente"]), "wset", key + "|" + val + "." + Math.max(0, i - 1), "", i <= 0 ? " disabled" : "") +
      Study.btn(tr(["Next step", "Étape suivante"]), "wset", key + "|" + val + "." + Math.min(n - 1, i + 1), "primary", i >= n - 1 ? " disabled" : "") +
      Study.btn(tr(["Restart", "Recommencer"]), "wset", key + "|" + val + ".0") + '<span class="ctl-l">' + tr(["Step ", "Étape "]) + (i + 1) + " / " + n + "</span></div>";
  }
  function parse(v, def) { var p = String(v || def).split("."); return { m: p[0], i: parseInt(p[1] || "0", 10) || 0 }; }

  /* ---------- widget: thread timeline (start / run / join) ---------- */
  Study.widgets.timeline = function (b, ctx) {
    var mode = ctx.get("start"), bars = TL[mode] || TL.start;
    function X(v) { return 120 + v * 86; } function Y(l) { return 30 + l * 62; }
    var cols = ["var(--c0)", "var(--c1)", "var(--c2)"];
    var s = '<svg viewBox="0 0 1000 230" width="100%" role="img" aria-label="thread timeline">';
    ["main", "T1", "T2"].forEach(function (n, l) { s += '<text class="sv-t" font-size="15" font-weight="600" x="20" y="' + (Y(l) + 24) + '">' + n + '</text><line x1="' + X(0) + '" y1="' + (Y(l) + 19) + '" x2="' + X(10) + '" y2="' + (Y(l) + 19) + '" style="stroke:var(--border)"/>'; });
    if (mode === "run") [1, 2].forEach(function (l) { s += '<text class="sv-m" font-size="14" x="' + X(5) + '" y="' + (Y(l) + 24) + '" text-anchor="middle">' + (fr() ? "aucun thread créé" : "no thread created") + "</text>"; });
    bars.forEach(function (br, i) {
      var fill = br.kind === "wait" ? "transparent" : br.kind === "call" ? cols[i % 2 === 1 ? 1 : 2] : cols[br.lane];
      s += '<rect x="' + X(br.a) + '" y="' + (Y(br.lane) + 4) + '" width="' + (X(br.b) - X(br.a) - 2) + '" height="30" rx="6" style="fill:' + fill + ";stroke:" + (br.kind === "wait" ? "var(--muted)" : "none") + '"' + (br.kind === "wait" ? ' stroke-dasharray="6 4"' : "") + "/>";
      s += '<text class="sv-mono" font-size="13" x="' + (X(br.a) + 8) + '" y="' + (Y(br.lane) + 24) + '" style="fill:' + (br.kind === "wait" ? "var(--text2)" : "#fff") + '">' + esc(tr(br.label)) + "</text>";
    });
    s += '<line x1="' + X(0) + '" y1="212" x2="' + X(10) + '" y2="212" style="stroke:var(--muted)"/><text class="sv-m" font-size="14" x="' + X(10) + '" y="206" text-anchor="end">' + (fr() ? "temps →" : "time →") + "</text></svg>";
    var note = mode === "start" ? ["Three threads run in parallel: \"je suis dans main\" and even \"fin de main\" can print before T1 and T2 finish.", "Trois threads en parallèle : « je suis dans main » et même « fin de main » peuvent s'afficher avant la fin de T1 et T2."] : mode === "run" ? ["run() is a plain method call: T1's code then T2's code run one after the other inside main. No thread is created.", "run() est un simple appel : le code de T1 puis celui de T2 s'exécutent l'un après l'autre dans main. Aucun thread n'est créé."] : ["join() blocks main until each thread is dead, so \"fin de main\" is always last.", "join() bloque main jusqu'à la mort de chaque thread : « fin de main » est toujours en dernier."];
    return wseg(ctx.key, [{ v: "start", l: "`T1.start(); T2.start();`" }, { v: "run", l: "`T1.run(); T2.run();`" }, { v: "join", l: "`start() + join()`" }], mode) + '<div class="svgw">' + s + '</div><p class="txt">' + rich(note) + "</p>";
  };

  /* ---------- widget: race on nb_places ---------- */
  Study.widgets.race = function (b, ctx) {
    var st = parse(ctx.get("none.0"), "none.0"), steps = RACE[st.m] || RACE.none, i = Math.min(st.i, steps.length - 1);
    var h = '<div class="seg">' + [["none", ["No protection", "Sans protection"]], ["mutex", ["With a mutex", "Avec un mutex"]]].map(function (o) { return '<button type="button" class="seg-b' + (o[0] === st.m ? " on" : "") + '" data-act="wset" data-arg="' + esc(ctx.key + "|" + o[0] + ".0") + '">' + rich(o[1]) + "</button>"; }).join("") + "</div>";
    h += stepBtns(ctx.key, st.m, i, steps.length);
    h += '<div class="race"><span class="rh">t</span><span class="rh">Client 1</span><span class="rh">Client 2</span><span class="rh rc">nb_places</span><span class="rt">0</span><span></span><span></span><span class="rn">1</span>';
    steps.forEach(function (s, k) {
      var vis = k <= i, cur = k === i;
      var box = '<div class="rbox w' + s.who + (cur ? " cur" : "") + (s.blocked ? " blk" : "") + '">' + rich(s.txt) + "</div>";
      h += '<span class="rt' + (vis ? "" : " fut") + '">' + (k + 1) + '</span><div class="' + (vis ? "" : "fut") + '">' + (s.who === 0 ? box : "") + '</div><div class="' + (vis ? "" : "fut") + '">' + (s.who === 1 ? box : "") + '</div><span class="rn' + (vis ? "" : " fut") + (s.bad ? " bad" : "") + '">' + s.nb + "</span>";
    });
    h += "</div>";
    h += Study.block(CO(st.m === "none" ? "warning" : "success", st.m === "none" ? ["Result: −1 seat", "Résultat : −1 place"] : ["Result: 0 seat, no overbooking", "Résultat : 0 place, pas de surréservation"], st.m === "none" ? ["Both clients tested before either decremented. The test and the update must be one exclusive block.", "Les deux clients ont testé avant toute décrémentation. Le test et la mise à jour doivent former un seul bloc exclusif."] : ["Client 2 waits on the mutex, then sees 0 and prints \"plus de places\".", "Le client 2 attend le mutex, puis voit 0 et affiche « plus de places »."]), ctx.key + ".co");
    return h;
  };

  /* ---------- widget: semaphore step viz (counter + queue) ---------- */
  Study.widgets.sem = function (b, ctx) {
    var pick = b.pick || [b.sc], st = parse(ctx.get(pick[0] + ".0"), pick[0] + ".0");
    if (pick.indexOf(st.m) < 0) st = { m: pick[0], i: 0 };
    var sc = SCRIPTS[st.m], n = sc.steps.length, i = Math.min(st.i, n - 1), x = sc.steps[i];
    var h = "";
    if (pick.length > 1) h += '<div class="seg">' + pick.map(function (k) { return '<button type="button" class="seg-b' + (k === st.m ? " on" : "") + '" data-act="wset" data-arg="' + esc(ctx.key + "|" + k + ".0") + '">' + rich(SCRIPTS[k].title) + "</button>"; }).join("") + "</div>";
    h += stepBtns(ctx.key, st.m, i, n);
    h += '<div class="semv"><div class="semv-op">' + esc(x.op) + '</div><div class="semv-vars">' + x.vars.map(function (v, k) { return '<div class="semv-v' + (k === 0 ? " main" : "") + '"><div class="semv-n">' + esc(v[0]) + '</div><div class="semv-x' + (/^[-−]/.test(v[1]) ? " neg" : "") + '">' + esc(v[1]) + "</div></div>"; }).join("") + "</div>";
    if (sc.items && x.items !== undefined) { h += '<div class="semv-lane"><span class="semv-l">' + rich(sc.items) + '</span><div class="semv-basket">'; for (var k = 0; k < x.items; k++) h += '<span class="semv-bag"></span>'; if (!x.items) h += '<span class="semv-e">' + tr(["empty", "vide"]) + "</span>"; h += "</div></div>"; }
    function lane(label, names, filled, empty) { return '<div class="semv-lane"><span class="semv-l">' + rich(label) + "</span>" + (names.length ? names.map(function (nm, k) { return '<span class="chip' + (filled ? " in" : " q") + '">' + (filled ? "" : k === 0 ? "→ " : "") + esc(nm) + "</span>"; }).join("") : '<span class="semv-e">' + tr(empty) + "</span>") + "</div>"; }
    h += lane(sc.inside, x.inside, true, ["(nobody)", "(personne)"]) + lane(sc.queue, x.queue, false, ["(empty)", "(vide)"]);
    h += '<div class="semv-note">' + rich(x.note) + "</div></div>";
    return h;
  };

  var TRACE_COLS = ["Instant", "P0", "P1", "flag[0]", "flag[1]", "token"];
  function tail(points, traps) { return { points: points, traps: traps }; }
  var body = {
    thr: { b: [
      sec(["Thread lifecycle (4 states)", "Cycle de vie d'un thread (4 états)"], [DG("horizontal", [{ id: "n", label: ["New (nouveau)", "Nouveau"], detail: ["after new", "après new"], kind: "terminal" }, { id: "e", label: ["Runnable (exécutable / actif)", "Exécutable / actif"], detail: ["after start()", "après start()"] }, { id: "w", label: ["Waiting / blocked (en attente)", "En attente / bloqué"], detail: ["uses no CPU", "n'utilise pas le CPU"], kind: "decision" }, { id: "m", label: ["Dead (mort)", "Mort"], kind: "terminal" }],
        [{ from: "n", to: "e", label: "start()" }, { from: "e", to: "w", label: ["sleep, wait, blocking I/O, locked object, suspend", "sleep, wait, E/S bloquante, objet verrouillé, suspend"] }, { from: "w", to: "e", label: ["timer over, notify, resume", "délai écoulé, notify, resume"], dashed: true }, { from: "e", to: "m", label: ["end of run(), uncaught exception, stop()", "fin de run(), exception non capturée, stop()"] }])]),
      sec(["start() vs run() vs join(): who runs when", "start() vs run() vs join() : qui s'exécute quand"], [W("timeline")], ["Pick a version of main", "Choisissez une version de main"]),
      sec(["Two ways to make a thread", "Deux façons de créer un thread"], [
        grid([code('// 1) extends Thread\nclass MonThread extends Thread {\n    MonThread(String nom) { super(nom); }\n    public void run() {\n        System.out.println("je suis " + getName());\n    }\n}\n// main: new MonThread("T1").start();'), code('// 2) implements Runnable (class already extends Mere)\nclass A extends Mere implements Runnable {\n    public void run() { /* ... */ }\n}\n// main:\nThread T = new Thread(new A());\nT.start();')]),
        tbl([["Method", "Méthode"], ["Role", "Rôle"]], cells([["`start()`", ["creates the thread, which calls run()", "crée le thread, qui appelle run()"]], ["`t.join()`", ["wait for the end of t (instance method)", "attendre la fin de t (méthode d'instance)"]], ["`Thread.sleep(ms)`", ["pause; needs try/catch InterruptedException", "pause ; try/catch InterruptedException"]], ["`getName()` / `setName()`", ["thread name, set by super(nom)", "nom du thread, fixé par super(nom)"]], ["`setPriority(1..10)`", ["priority", "priorité"]], ["`yield()`", ["offer the CPU to another thread", "céder le CPU à un autre thread"]], ["`isAlive()`, `activeCount()`, `currentThread()`", ["state queries", "interrogations d'état"]]]))])
    ], points: [["A thread is a light process inside a program; main is a thread too.", "Un thread est un processus léger dans un programme ; main est aussi un thread."], ["extends Thread in 4 steps: subclass, override run(), create the object, call start().", "extends Thread en 4 étapes : sous-classe, redéfinir run(), créer l'objet, appeler start()."], ["Runnable when the class already extends another one (no multiple inheritance).", "Runnable quand la classe hérite déjà d'une autre (pas d'héritage multiple)."], ["Parallel merge sort: two threads sort the halves, join, then merge: [3, 5, 9, 10, 14, 27, 38, 43, 61, 82].", "Tri fusion parallèle : deux threads trient les moitiés, join, puis fusion : [3, 5, 9, 10, 14, 27, 38, 43, 61, 82]."]],
      traps: [["run() instead of start(): no thread.", "run() au lieu de start() : pas de thread."], ["join is an instance method (the slide shows it as static).", "join est une méthode d'instance (la slide la montre statique)."], ["stop / suspend / resume are deprecated; java.lang needs no import.", "stop / suspend / resume sont dépréciées ; java.lang ne s'importe pas."], ["sleep, join, acquire and await need try/catch (InterruptedException).", "sleep, join, acquire et await exigent try/catch (InterruptedException)."]] },
    cs: { b: [
      sec(["Race on a shared counter: plane booking, nb_places = 1", "Course critique sur un compteur partagé : réservation, nb_places = 1"], [W("race")], ["Step through the interleaving, then switch on the mutex", "Avancez pas à pas dans l'entrelacement, puis activez le mutex"]),
      sec(["Entering and leaving the critical section", "Entrée et sortie de la section critique"], [
        DG("horizontal", [{ id: "nc", label: ["Non-critical section", "Section non critique"] }, { id: "in", label: ["Entry protocol", "Protocole d'entrée"], detail: "P(s) / acquire()", kind: "decision" }, { id: "sc", label: ["CRITICAL SECTION", "SECTION CRITIQUE"], detail: ["touches the shared data", "accède aux données partagées"], kind: "terminal" }, { id: "out", label: ["Exit protocol", "Protocole de sortie"], detail: "V(s) / release()" }],
          [{ from: "nc", to: "in" }, { from: "in", to: "sc", label: ["allowed", "autorisé"] }, { from: "sc", to: "out" }, { from: "out", to: "nc", dashed: true, label: ["loop", "boucle"] }]),
        tbl([["Property", "Propriété"], ["Meaning", "Sens"], ["Violated when", "Violée quand"]], cells([["Sûreté (safety)", ["never two processes in the SC", "jamais deux processus en SC"], { t: ["both in the SC (TD1 Ex1)", "les deux en SC (TD1 Ex1)"], tone: "danger" }], ["Vivacité (liveness)", ["whoever asks eventually enters", "qui demande finit par entrer"], { t: ["someone waits forever", "quelqu'un attend indéfiniment"], tone: "warning" }], ["Robustesse", ["a process outside the SC (or stopped) does not block the others", "un processus hors SC (ou arrêté) ne bloque pas les autres"], { t: ["an outsider blocks entry", "un processus extérieur bloque l'entrée"], tone: "warning" }]]))]),
      sec(["TD1 Ex1: the counterexample trace", "TD1 Ex1 : la trace contre-exemple"], [{ t: "trace", cols: TRACE_COLS, rows: TRACE }], ["One action per instant. Step until both are in the SC", "Une action par instant. Avancez jusqu'à ce que les deux soient en SC"])
    ], points: [["Critical section = the code that touches the shared variable.", "Section critique = le code qui touche la variable partagée."], ["Entry protocol / SC / exit protocol.", "Protocole d'entrée / SC / protocole de sortie."], ["Fix a race by making the test and the update exclusive (atomic).", "On corrige une course en rendant le test et la mise à jour exclusifs (atomiques)."]],
      traps: [["Protecting only the update is not enough: the test must be inside too.", "Protéger seulement la mise à jour ne suffit pas : le test doit être dedans."], ["In a trace, write one action per instant and the values of every shared variable.", "Dans une trace, une action par instant et la valeur de chaque variable partagée."], ["Both in SC = sûreté; waiting forever = vivacité.", "Les deux en SC = sûreté ; attente infinie = vivacité."]] },
    sem: { b: [
      sec(["Semaphore counter and waiting queue, P/V step by step", "Compteur et file d'attente du sémaphore, P/V pas à pas"], [W("sem", { pick: ["mutex", "order", "bridge"] })], ["Pick a scenario, then step", "Choisissez un scénario, puis avancez"]),
      sec(["P, V and the Java API", "P, V et l'API Java"], [
        grid([tbl([["Course", "Cours"], "Java", ["Effect", "Effet"]], cells([["P(s)", "`s.acquire()`", ["if s > 0 then s − 1, else wait", "si s > 0 alors s − 1, sinon attendre"]], ["V(s)", "`s.release()`", ["s + 1; a waiter can continue", "s + 1 ; un processus en attente peut continuer"]], ["P(s) × n", "`s.acquire(n)`", ["takes n at once (all-or-nothing)", "prend n d'un coup (tout ou rien)"]], ["V(s) × n", "`s.release(n)`", ["gives back n", "rend n"]], ["-", "`s.availablePermits()`", ["current value", "valeur courante"]], ["-", "`new Semaphore(k, true)`", ["FIFO (fair) waiting", "attente FIFO (équitable)"]]])),
          tbl([["Initial value", "Valeur initiale"], ["Use", "Usage"], ["Example", "Exemple"]], cells([["1", "Mutex", ["plane booking, the board", "réservation, la planche"]], ["0", ["Ordering: wait for a signal", "Ordre : attendre un signal"], ["B after A, sA23, fumeur[i]", "B après A, sA23, fumeur[i]"]], ["k", ["k identical resources", "k ressources identiques"], ["bridge (3), N vehicles, N packets", "pont (3), N véhicules, N paquets"]]]))]),
        code("import java.util.concurrent.Semaphore;\nstatic Semaphore mutex = new Semaphore(1);\ntry {\n    mutex.acquire();\n    // section critique\n    mutex.release();\n} catch (InterruptedException e) {}")])
    ], points: [["A semaphore is an integer + a queue, touched only by P and V (atomic).", "Un sémaphore = un entier + une file, manipulé seulement par P et V (atomiques)."], ["It remembers: a V with nobody waiting raises the counter.", "Il mémorise : un V sans personne en attente augmente le compteur."], ["Init 1 = mutex, 0 = ordering, k = counting.", "Init 1 = mutex, 0 = ordre, k = compteur."], ["Reservation: 3 seats, 5 clients → 3 book, 2 \"plus de places\", 0 left.", "Réservation : 3 places, 5 clients → 3 réservent, 2 « plus de places », reste 0."]],
      traps: [["The slides write \"aquire\": write acquire.", "Les slides écrivent « aquire » : écrivez acquire."], ["Always declare the semaphores with their initial values (the papers grade it).", "Toujours déclarer les sémaphores avec leur valeur initiale (c'est noté)."], ["One release per acquire on every path, or the permit is lost.", "Un release par acquire sur tous les chemins, sinon le jeton est perdu."], ["Never block on a resource while holding a mutex.", "Ne jamais se bloquer sur une ressource en tenant un mutex."]] },
    ord: { b: [
      sec(["Dependency graphs: who releases whom", "Graphes de dépendance : qui libère qui"], [grid([
        sec(["A then B", "A puis B"], [DG("vertical", [{ id: "a", label: "A" }, { id: "b", label: "B", detail: "s = 0" }], [{ from: "a", to: "b", label: "s" }])]),
        sec(["Token ring (Ex1 Q1)", "Anneau à jeton (Ex1 Q1)"], [DG("vertical", [{ id: "p1", label: "P1: A1", detail: "s1 = 1", kind: "terminal" }, { id: "p2", label: "P2: A2", detail: "s2 = 0" }, { id: "p3", label: "P3: A3", detail: "s3 = 0" }], [{ from: "p1", to: "p2", label: "s2" }, { from: "p2", to: "p3", label: "s3" }, { from: "p3", to: "p1", label: "s1", dashed: true }])]),
        sec(["A1 (A2 or A3) (Ex1 Q2)", "A1 (A2 ou A3) (Ex1 Q2)"], [DG("vertical", [{ id: "a1", label: "P1: A1", detail: "sA1 = 1", kind: "terminal" }, { id: "or", label: ["one of", "l'un de"], detail: "sA23 = 0", kind: "decision" }, { id: "a2", label: "P2: A2" }, { id: "a3", label: "P3: A3" }], [{ from: "a1", to: "or", label: "sA23" }, { from: "or", to: "a2" }, { from: "or", to: "a3" }, { from: "a2", to: "a1", label: "sA1", dashed: true }, { from: "a3", to: "a1", label: "sA1", dashed: true }])])
      ], 3)], ["An arrow X → Y labelled s means: X does s.release(), Y does s.acquire()", "Une flèche X → Y étiquetée s : X fait s.release(), Y fait s.acquire()"]),
      sec(["Recipe for an ordering question", "Méthode pour une question d'ordre"], [{ t: "steps", steps: [
        { title: ["Draw the graph: one arrow per \"must wait for\".", "Dessiner le graphe : une flèche par « doit attendre »."] },
        { title: ["One semaphore per arrow (or shared when several wait for the same event, like sA23).", "Un sémaphore par flèche (ou partagé si plusieurs attendent le même événement, comme sA23)."] },
        { title: ["Init 1 for whoever starts, 0 for the others.", "Init 1 pour celui qui commence, 0 pour les autres."] },
        { title: ["Each process: acquire its own, act, release the next one's.", "Chaque processus : acquire le sien, agir, release celui du suivant."] },
        { title: ["Repeating sequence: wrap in while (true). Check it against an example output.", "Suite répétée : while (true). Vérifier sur un exemple de sortie."] }] }])
    ], points: [["Token ring: s1 = 1, s2 = 0, s3 = 0 → A1 A2 A3.", "Anneau : s1 = 1, s2 = 0, s3 = 0 → A1 A2 A3."], ["A1 (A2|A3): sA1 = 1, sA23 = 0. One release of sA23 lets exactly one of P2/P3 through.", "A1 (A2|A3) : sA1 = 1, sA23 = 0. Un release de sA23 laisse passer exactement un de P2/P3."], ["The start() order of the threads never matters.", "L'ordre des start() n'a jamais d'importance."]],
      traps: [["All semaphores at 0: deadlock. All at 1: no order.", "Tous à 0 : interblocage. Tous à 1 : aucun ordre."], ["Use the number of semaphores the question imposes.", "Utiliser le nombre de sémaphores imposé."], ["The DS writes 'A1': in Java a String needs \"A1\".", "Le DS écrit 'A1' : en Java une String s'écrit \"A1\"."]] },
    story: { b: [
      sec(["Producer / consumer: the bakery basket", "Producteur / consommateur : le panier de la boulangerie"], [W("sem", { sc: "bakery" })], ["Step: a seller wants 2 baguettes before any exist", "Pas à pas : un vendeur veut 2 baguettes avant qu'elles n'existent"]),
      sec(["Method for any story problem", "Méthode pour tout problème « histoire »"], [
        DG("horizontal", [{ id: "r", label: ["1. Resources + capacity", "1. Ressources + capacité"], detail: ["→ semaphore + initial value", "→ sémaphore + valeur initiale"] }, { id: "c", label: ["2. Shared counters", "2. Compteurs partagés"], detail: ["→ a mutex each", "→ un mutex chacun"] }, { id: "t", label: ["3. Thread classes", "3. Classes Thread"], detail: ["acquire → print → release", "acquire → affichage → release"] }, { id: "m", label: ["4. main", "4. main"], detail: "start() + join()", kind: "terminal" }], [{ from: "r", to: "c" }, { from: "c", to: "t" }, { from: "t", to: "m" }]),
        tbl([["Problem", "Problème"], ["Semaphores (init)", "Sémaphores (init)"], ["Key move", "Geste clé"]], cells([[["Bridge 15 t (DS CS Ex2)", "Pont 15 t (DS CS Ex2)"], "charge = 3 (fair), mutex = 1", ["car acquire(1), truck acquire(3)", "voiture acquire(1), camion acquire(3)"]], [["N vehicles (tutor variant)", "N véhicules (variante tuteur)"], "places = N (fair), mutex = 1", ["everyone acquire(1)", "tout le monde acquire(1)"]], [["Board (GLID Ex1 Q1)", "Planche (GLID Ex1 Q1)"], "planche = 1", ["update t_utilisation before release", "mettre à jour t_utilisation avant release"]], [["2 types of 3 (GLID Q2)", "2 types sur 3 (GLID Q2)"], "types = 2, mutexType[i] = 1, mutexP = 1", ["first in acquires, last out releases", "premier entré acquiert, dernier sorti libère"]], [["N packets (GLID Q3)", "N paquets (GLID Q3)"], "placesPaquets = N", "acquire(paquets) / release(paquets)"], [["Bakery (TD1 Ex2)", "Boulangerie (TD1 Ex2)"], "mutex = 1, dispo = 0", ["dispo.acquire(k) outside the mutex", "dispo.acquire(k) hors du mutex"]], [["Smokers (TD1 Ex3)", "Fumeurs (TD1 Ex3)"], "agent = 1, fumeur[i] = 0", ["the agent wakes ONE chosen smoker", "l'agent réveille UN fumeur choisi"]]]))]),
      sec(["Smokers: why the naïve version blocks", "Fumeurs : pourquoi la version naïve se bloque"], [grid([
        DG("vertical", [{ id: "ag", label: ["Agent puts paper + matches", "L'agent pose papier + allumettes"], kind: "terminal" }, { id: "f1", label: ["Smoker with tobacco takes paper", "Le fumeur au tabac prend le papier"] }, { id: "f2", label: ["Smoker with paper takes matches", "Le fumeur au papier prend les allumettes"] }, { id: "dl", label: ["Both wait for the other ingredient: deadlock", "Les deux attendent l'autre ingrédient : interblocage"], kind: "decision", tone: "danger" }], [{ from: "ag", to: "f1" }, { from: "ag", to: "f2" }, { from: "f1", to: "dl" }, { from: "f2", to: "dl" }]),
        DG("vertical", [{ id: "a", label: "agent.acquire()", detail: "agent = 1", kind: "terminal" }, { id: "i", label: ["choose i at random", "choisir i au hasard"], kind: "decision" }, { id: "r", label: "fumeur[i].release()" }, { id: "s", label: ["Smoker i smokes, then agent.release()", "Le fumeur i fume, puis agent.release()"] }], [{ from: "a", to: "i" }, { from: "i", to: "r" }, { from: "r", to: "s" }, { from: "s", to: "a", dashed: true, label: ["next round", "tour suivant"] }])])])
    ], points: [["Count capacity in units and take it with ONE acquire(n).", "Compter la capacité en unités et la prendre en UN SEUL acquire(n)."], ["Every shared counter (nb, nbPaquets, baguettes) gets a mutex.", "Chaque compteur partagé (nb, nbPaquets, baguettes) a son mutex."], ["Group limits use first-in / last-out with a per-group counter.", "Les limites par groupe utilisent premier entré / dernier sorti avec un compteur par groupe."], ["\"Supposons maintenant…\" questions add one semaphore on top of the previous answer.", "Les questions « Supposons maintenant… » ajoutent un sémaphore à la réponse précédente."]],
      traps: [["3 × acquire() for a truck can deadlock; use acquire(3).", "3 × acquire() pour un camion peut interbloquer ; utiliser acquire(3)."], ["Blocking on dispo while holding the mutex freezes the bakers.", "Se bloquer sur dispo en tenant le mutex gèle les boulangers."], ["Forgetting fair = true can starve trucks.", "Oublier fair = true peut affamer les camions."], ["Print exactly what the statement asks (name, count, type).", "Afficher exactement ce que demande l'énoncé (nom, nombre, type)."]] },
    mon: { b: [
      sec(["A monitor and its queues", "Un moniteur et ses files"], [
        DG("horizontal", [{ id: "eq", label: ["Entry queue (FIFO)", "File d'entrée (FIFO)"], detail: ["delayed calls", "appels retardés"] }, { id: "m", label: ["Monitor: ONE thread inside", "Moniteur : UN seul thread dedans"], detail: ["shared variables + procedures", "variables partagées + procédures"], kind: "terminal" }, { id: "cq", label: ["Condition queue c (FIFO)", "File de la condition c (FIFO)"], detail: ["e.g. salleVide", "ex. salleVide"], kind: "decision" }, { id: "x", label: ["Leaves", "Sort"] }],
          [{ from: "eq", to: "m", label: "lock()" }, { from: "m", to: "cq", label: ["await(): blocks AND releases the lock", "await() : bloque ET libère le verrou"] }, { from: "cq", to: "m", label: ["signal(): first waiter re-enters", "signal() : le premier rentre"], dashed: true }, { from: "m", to: "x", label: ["unlock() in finally", "unlock() dans finally"] }]),
        tbl(["", ["Semaphore", "Sémaphore"], ["Condition (monitor)", "Condition (moniteur)"]], cells([[["Wait", "Attente"], ["P(s) waits only if s = 0", "P(s) attend seulement si s = 0"], ["wait(c) / await() ALWAYS blocks", "wait(c) / await() bloque TOUJOURS"]], [["Signal with nobody waiting", "Signal sans personne en attente"], { t: ["remembered (s + 1)", "mémorisé (s + 1)"], tone: "success" }, { t: ["lost", "perdu"], tone: "danger" }], [["Counts?", "Compte ?"], ["yes", "oui"], ["no; test with nonempty(c)", "non ; tester avec nonempty(c)"]], ["Java", "`Semaphore`", "`ReentrantLock` + `newCondition()`"]]))]),
      sec(["Baggage room (GLID Ex2) step by step", "Salle de bagages (GLID Ex2) pas à pas"], [W("sem", { sc: "bag" })])
    ], points: [["3 rules: mutual exclusion (FIFO entry queue), condition variables (FIFO queues), priority to woken processes.", "3 règles : exclusion mutuelle (file d'entrée FIFO), variables condition (files FIFO), priorité aux processus réveillés."], ["Java: Lock lock = new ReentrantLock(true); Condition c = lock.newCondition(); await / signal / signalAll.", "Java : Lock lock = new ReentrantLock(true); Condition c = lock.newCondition(); await / signal / signalAll."], ["Bridge as a monitor: while (charge + poids > 15) place.await(); and signalAll() on exit.", "Pont en moniteur : while (charge + poids > 15) place.await(); et signalAll() à la sortie."]],
      traps: [["await in a while, never an if.", "await dans un while, jamais un if."], ["unlock() in finally, even with return false inside.", "unlock() dans finally, même avec return false dedans."], ["ReentrantLock is the class, Lock the interface.", "ReentrantLock est la classe, Lock l'interface."], ["Waiting room: test the chairs BEFORE waiting.", "Salle d'attente : tester les chaises AVANT d'attendre."]] }
  };

  /* ---------- past exams: hint → plan → full Java (3 nested reveals, same order as the canvas) ---------- */
  function paperOf(e) { var p = tr(e.paper); var i = p.indexOf(" · "); return i < 0 ? p : p.slice(0, i); }
  function exPart(e) {
    var full = e.trace ? [{ t: "table", cols: TRACE_COLS, rows: TRACE, emph: TRACE.length - 1 }] : [code(e.code)];
    if (e.check) full.push(CO("warning", ["What the grader checks", "Ce que le correcteur vérifie"], e.check.map(tr).join(" ")));
    var plan = [{ t: "h", x: ["Plan: declarations and initial values", "Plan : déclarations et valeurs initiales"] }, tbl([["Name", "Nom"], ["Initial value", "Valeur initiale"], ["Role", "Rôle"]], e.plan.map(function (r) { return ["`" + r[0] + "`", r[1], r[2]]; }))];
    if (e.planNote) plan.push(P(e.planNote));
    plan.push({ t: "reveal", label: e.trace ? ["3. Full trace", "3. Trace complète"] : ["3. Full Java", "3. Java complet"], hide: ["Hide", "Masquer"], b: full });
    var q = [grid([{ t: "callout", tone: "info", lead: ["Original statement (FR)", "Énoncé original (FR)"], x: e.fr }, { t: "callout", tone: "info", lead: ["English translation", "Traduction anglaise"], x: e.en }])];
    if (e.given) q.push({ t: "code", x: e.given, lang: "java" });
    var tp = tr(e.paper), j = tp.indexOf(" · ");
    return { h: (j < 0 ? "" : tp.slice(j + 3) + " · ") + tr(e.title), q: q, solLabel: ["1. Hint", "1. Indice"], sol: [CO("info", ["Hint", "Indice"], e.hint), { t: "reveal", label: ["2. Semaphore plan", "2. Plan des sémaphores"], hide: ["Hide", "Masquer"], b: plan }] };
  }
  var PAST = [], byPaper = {};
  EXS.forEach(function (e) {
    var key = typeof e.paper === "string" ? e.paper.split(" · ")[0] : e.id;
    if (!byPaper[key]) { byPaper[key] = { id: "p" + PAST.length, title: typeof e.paper === "string" ? key : e.paper, exs: [] }; PAST.push(byPaper[key]); }
    byPaper[key].exs.push(e);
  });
  PAST = PAST.map(function (p) {
    var m = /(\d+)h(\d+)?/.exec(typeof p.title === "string" ? p.title : "");
    return { id: p.id, title: p.title, minutes: m ? parseInt(m[1], 10) * 60 + (m[2] ? parseInt(m[2], 10) : 0) : 30, meta: ["Try on paper first, then reveal: hint → semaphore plan → full Java", "Essayez d'abord sur papier, puis dévoilez : indice → plan des sémaphores → Java complet"], parts: p.exs.map(exPart) };
  });

  Study.register({
    id: "pcp",
    codeLang: "java",
    tagline: ["6 visual lessons, 9 code patterns, 12 past-paper exercises (hint → plan → Java), " + BANK.length + " concept checks, 2 mocks.", "6 leçons visuelles, 9 modèles de code, 12 exercices d'anciens DS (indice → plan → Java), " + BANK.length + " QCM, 2 examens blancs."],
    summary: ["Visual lessons, every past-paper exercise with step-by-step solutions, code patterns, concept checks and a mock for the written DS on Thursday 5 November 2026 at 9:00.", "Leçons visuelles, tous les exercices des anciens DS avec solutions pas à pas, modèles de code, QCM de vérification et examen blanc pour le DS écrit du jeudi 5 novembre 2026 à 9h00."],
    sources: SRC,
    lessonCaption: ["Course order. Visual first, then key points, traps and a mini-quiz", "Ordre du cours. Visuel d'abord, puis points clés, pièges et mini-quiz"],
    bankCaption: ["Single answer: click to see the result. Multi-answer: tick, then Check. The real exam is written code; these checks train the ideas behind it.", "Réponse unique : cliquez pour voir le résultat. Réponses multiples : cochez, puis Vérifier. Le vrai DS est du code écrit ; ces QCM entraînent les idées derrière."],
    mockCaption: ["16 concept questions, no feedback until you submit; exact match = 1 point", "16 questions, pas de correction avant de valider ; réponse exacte = 1 point"],
    lessons: LESSONS.map(function (l) { var x = body[l.id]; return { id: l.id, label: l.label, b: x.b, points: x.points, traps: x.traps }; }),
    bank: BANK,
    mocks: { A: { ids: MOCK.A, minutes: 20, label: ["Set A", "Série A"], note: ["Real 1-hour drill: set a 1-hour timer and write DS 2024 CS (Ex1 Q1, Q2, Ex2) on paper with no notes, then compare with Past exams. As a second mock, do the GLID paper Ex1.", "Vrai entraînement d'1 heure : lancez un minuteur d'1 heure et rédigez le DS 2024 CS (Ex1 Q1, Q2, Ex2) sur papier sans notes, puis comparez avec Anciens DS. En second examen blanc, faites l'Ex1 du sujet GLID."] }, B: { ids: MOCK.B, minutes: 20, label: ["Set B", "Série B"] } },
    extraTabs: [{ id: "patterns", label: ["Patterns", "Modèles de code"], h: ["Patterns: code templates to know by heart", "Modèles de code à connaître par cœur"], cap: ["Every past-paper answer is built from these blocks", "Chaque réponse des anciens DS est construite avec ces blocs"],
      b: [grid(PATTERNS.map(function (p) { return sec(p.title, [code(p.code)], p.when); }), 2)] }],
    past: PAST,
    pastLabel: ["Past exams", "Anciens DS"],
    materials: MATERIALS.filter(function (m) { return m.path.indexOf("course/view") < 0; }).map(function (m) { return { title: m.title, kind: m.kind, note: ["Moodle folder (module link not confirmed; the course page always works)", "Dossier Moodle (lien de module non confirmé ; la page du cours fonctionne toujours)"] }; }),
    cheat: CHEAT,
    exam: {
      props: [{ label: "Date", value: ["Thursday 5 November 2026, 9:00 (Tunis)", "Jeudi 5 novembre 2026, 9h00 (Tunis)"] }, { label: ["Length", "Durée"], value: ["1 hour", "1 heure"] }, { label: "Format", value: ["Written: Java code on paper", "Écrit : code Java sur papier"] }, { label: ["Allowed", "Autorisé"], value: ["No documents, no PC", "Documents et PC non autorisés"] }, { label: ["Past papers", "Anciens sujets"], value: ["2 exercises, each a story answered with full Java code", "2 exercices, chacun une « histoire » résolue en code Java complet"] }],
      b: [
        { t: "bars", bars: [{ l: ["Semaphore story + variants", "Histoire à sémaphores + variantes"], v: 55, d: "≈ 50–60%" }, { l: ["Ordering schemes or a monitor story", "Schémas d'ordre ou histoire à moniteur"], v: 45, d: "≈ 40–50%" }], emph: 0 },
        P(["Weighting is the tutor's estimate from the two 2024 papers (CS \"Révision\" and GLID 04/11/2024, same teacher). The GLID paper is filed as \"Programmation\" but its header says PCP, and it has a monitor exercise.", "La pondération est une estimation du tuteur à partir des deux DS 2024 (CS « Révision » et GLID du 04/11/2024, même enseignante). Le sujet GLID est classé « Programmation » mais son en-tête dit PCP, et il contient un exercice de moniteur."]),
        CO("warning", ["On paper, no compiler", "Sur papier, sans compilateur"], ["Declare every semaphore with its initial value, give all the classes when asked, wrap acquire/sleep/await in try/catch, and print exactly what the statement asks.", "Déclarez chaque sémaphore avec sa valeur initiale, donnez toutes les classes quand c'est demandé, entourez acquire/sleep/await d'un try/catch, et affichez exactement ce que demande l'énoncé."])
      ]
    }
  });
})();
