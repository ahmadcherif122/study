/* DL — ported 1:1 from the canvas "Deep Learning: exam prep" (8 lessons with perceptron / activation / gradient / batch / confusion-matrix / convolution / pooling / architecture visuals, 12 course-quiz + 32 practice + 21 lesson-check QCM, 2 mocks of 20, cheat sheet). Values marked "tutor" are the tutor's, not an official correction. */
(function () {
  var tr = Study.tr, esc = Study.esc, rich = Study.rich, wseg = Study.wseg;
  function fr() { return Study.lang() === "fr"; }
  function L(b) { return tr(b); }
  function sec(h, b, cap) { return { t: "sec", h: h, cap: cap, b: b }; }
  function tbl(cols, rows, o) { var x = { t: "table", cols: cols, rows: rows }; if (o) for (var k in o) x[k] = o[k]; return x; }
  function P(x) { return { t: "p", x: x }; }
  function grid(b, cols) { return { t: "grid", cols: cols || 2, b: b }; }
  function CO(tone, lead, x) { return { t: "callout", tone: tone, lead: lead, x: x }; }
  function DG(dir, nodes, edges) { return { t: "diagram", dir: dir, nodes: nodes, edges: edges }; }
  function W(w, o) { var x = { t: "widget", w: w }; if (o) for (var k in o) x[k] = o[k]; return x; }
  function SEG(opts, panes, def) { return { t: "seg", opts: opts.map(function (o) { return { v: o[0], l: o[1] }; }), panes: panes, def: def }; }
  function EQ(parts) { return { t: "eq", x: parts }; }
  function PR(items) { return { t: "props", items: items }; }
  function STEPS(s) { return { t: "steps", steps: s.map(function (x) { return { title: x[0], detail: x[1] }; }) }; }
  function T(x, y, s, cls, ex) { return '<text x="' + x + '" y="' + y + '" class="' + (cls || "sv-2") + '"' + (ex || "") + ">" + esc(s) + "</text>"; }
  function svg(vb, label, inner) { return '<div class="svgw"><svg viewBox="' + vb + '" width="100%" role="img" aria-label="' + esc(label) + '">' + inner + "</svg></div>"; }
  function C(i) { return "var(--c" + i + ")"; }
  var AA = ' fill-opacity="0.18"';
  var LAB = ' font-size="15"', HEAD = ' font-size="18" font-weight="600"', VAL = ' font-size="16" font-weight="600"';
  function nf(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, fr() ? " " : ","); }
  function fmt(v) { return Number.isInteger(v) ? String(v) : String(Math.round(v * 1000) / 1000); }
  function r2(v) { return (Math.round(v * 100) / 100).toFixed(2); }
  function segRow(key, opts, cur, act) { return '<div class="seg">' + opts.map(function (o) { return '<button type="button" class="seg-b' + (o[0] === cur ? " on" : "") + '" data-act="' + (act || "wset") + '" data-arg="' + esc(key + "|" + (o[2] != null ? o[2] : o[0])) + '">' + rich(o[1]) + "</button>"; }).join("") + "</div>"; }

var SRC = { "Course quiz": ["Course quiz", "Quiz du cours"], Practice: ["Practice", "Entraînement"], "Lesson check": ["Lesson check", "Vérif. leçon"] };
var LESSONS = [
  { id: "intro", label: ["1. Big picture: AI, ML, DL", "1. Vue d'ensemble : IA, ML, DL"] },
  { id: "perc", label: ["2. Neuron & perceptron", "2. Neurone & perceptron"] },
  { id: "mlp", label: ["3. MLP & activation functions", "3. PMC & fonctions d'activation"] },
  { id: "gd", label: ["4. Gradient descent, losses, backprop", "4. Descente de gradient, pertes, rétropropagation"] },
  { id: "batch", label: ["5. Epochs, batches, optimizers", "5. Époques, batchs, optimiseurs"] },
  { id: "eval", label: ["6. Evaluation & overfitting (TP1)", "6. Évaluation & sur-apprentissage (TP1)"] },
  { id: "conv", label: ["7. Convolution & pooling", "7. Convolution & pooling"] },
  { id: "arch", label: ["8. CNN shapes & parameters (TP1, TP2)", "8. Formes & paramètres CNN (TP1, TP2)"] },
];
var MATERIALS = [
  { title: ["Introduction to Deep Learning", "Introduction au Deep Learning"], path: "mod/resource/view.php?id=5787", kind: ["Course", "Cours"] },
  { title: ["Ch1: Deep neural networks (Réseaux de neurones profonds)", "Ch1 : Réseaux de neurones profonds"], path: "mod/resource/view.php?id=5790", kind: ["Course", "Cours"] },
  { title: ["Ch2: Convolutional neural networks (Réseaux de neurones convolutifs)", "Ch2 : Réseaux de neurones convolutifs"], path: "mod/resource/view.php?id=5792", kind: ["Course", "Cours"] },
  { title: ["TP1 statement (énoncé)", "TP1 énoncé"], path: "mod/resource/view.php?id=5798", kind: ["Lab", "TP"] },
  { title: ["TP1 solution (correction)", "TP1 correction"], path: "mod/resource/view.php?id=5799", kind: ["Lab", "TP"] },
  { title: ["TP2 statement (énoncé)", "TP2 énoncé"], path: "mod/resource/view.php?id=5801", kind: ["Lab", "TP"] },
  { title: ["Deep Learning course page", "Page du cours Deep Learning"], path: "course/view.php?id=1284", kind: ["Course page", "Page du cours"] },
];
var VF = [["True (Vrai)", "Vrai"], ["False (Faux)", "Faux"]];

var BANK = [
  // ---------------- Course quizzes (French = original wording) ----------------
  { id: "Intro Q1", s: "Course quiz", t: "intro", m: false, q: ["Deep learning integrates both high-level feature detection and classification. It needs massive amounts of data and a GPU.", "L'apprentissage profond intègre à la fois la détection des descripteurs de haut niveau et la classification. Il nécessite une quantité de données massives et un GPU."], o: VF, a: [0], w: ["That is the ML vs DL slide: DL is end-to-end, Big Data, GPU.", "C'est la slide ML vs DL : le DL est de bout en bout, Big Data, GPU."] },
  { id: "Intro Q2", s: "Course quiz", t: "intro", m: true, q: ["TensorFlow 2.x…", "TensorFlow 2.x…"], o: [["Integrates Keras, which greatly improves usability", "Intègre Keras, ce qui améliore considérablement la convivialité"], ["Is an open-source framework", "Est un Framework Open Source"], ["Is a flexible framework", "Est un Framework flexible"], ["Was invented by Facebook", "Est inventé par Facebook"]], a: [0, 1, 2], w: ["TensorFlow comes from Google; PyTorch is Facebook's.", "TensorFlow vient de Google ; PyTorch est celui de Facebook."] },
  { id: "Intro Q3", s: "Course quiz", t: "intro", m: false, q: ["Which of these is not a deep learning development framework?", "Parmi les éléments suivants, lequel ne fait pas partie du Framework de développement de Deep Learning ?"], o: ["Caffe", "Keras", "scikit-learn", "MXNet"], a: [2], w: ["scikit-learn is classic ML.", "scikit-learn, c'est du ML classique."] },
  { id: "Ch1 Q1", s: "Course quiz", t: "perc", m: false, q: ["The XOR problem can be solved with a simple perceptron.", "Le problème XOR peut être résolu en utilisant un perceptron simple."], o: VF, a: [1], w: ["XOR is not linearly separable: one line cannot split it.", "XOR n'est pas linéairement séparable : une seule droite ne suffit pas."] },
  { id: "Ch1 Q2", s: "Course quiz", t: "perc", m: false, q: ["Observation Z(4,6,7,1): 3 features and a class (0 or 1). Passing it through a perceptron does not change the weights, given η = all weights = 1.", "Étant donnée l'observation Z(4,6,7,1) de trois descripteurs et une classe (0 ou 1), le passage de cette observation sur un perceptron ne change pas les poids sachant que η = tous les poids = 1."], o: VF, a: [0], w: ["Y = 4 + 6 + 7 + 1 (bias) = 18 ≥ 0, so the output is 1 = d: no update.", "Y = 4 + 6 + 7 + 1 (biais) = 18 ≥ 0, donc sortie 1 = d : pas de mise à jour."] },
  { id: "Ch1 Q3", s: "Course quiz", t: "perc", m: false, q: ["How many parameters in total does a simple perceptron learn on a dataset of 200 observations and 20 features?", "Combien il existe de paramètres à apprendre au total à partir d'un perceptron simple entraîné sur un dataset comportant 200 observations et 20 descripteurs ?"], o: ["201", "200", "21", "20"], a: [2], w: ["20 weights + 1 bias. The number of observations never matters.", "20 poids + 1 biais. Le nombre d'observations ne compte jamais."] },
  { id: "Ch1 Q4", s: "Course quiz", t: "gd", m: false, q: ["Binary cross-entropy is suited to binary classification problems.", "L'erreur Binary cross entropy est adaptée aux problèmes de classification binaire."], o: VF, a: [0], w: ["BCE goes with 1 sigmoid output neuron.", "BCE va avec 1 neurone de sortie sigmoïde."] },
  { id: "Ch1 Q5", s: "Course quiz", t: "batch", m: true, q: ["Which statements are correct?", "Lesquelles des affirmations suivantes sont correctes ?"], o: [["Classic gradient descent (BGD) is fast and reliable", "L'algorithme de descente de gradient classique (BGD) est rapide et fiable"], ["BGD risks falling into a local minimum", "L'algorithme BGD risque tomber dans le local minimum"], ["Stochastic gradient descent is fast but unstable", "L'algorithme de descente de gradient stochastique est rapide mais instable"], ["Batch processing speeds up convergence compared with BGD thanks to frequent weight updates", "Le traitement par lot accélère la convergence par rapport à la descente de gradient classique (BGD) grâce à une mise à jour fréquente des poids"]], a: [1, 2, 3], w: ["BGD is stable but slow, not fast.", "BGD est stable mais lent, pas rapide."] },
  { id: "Ch1 Q6", s: "Course quiz", t: "batch", m: false, q: ["A training set of 100 observations with a batch size of 1. Then…", "Étant donné une base d'apprentissage de 100 observations avec la taille d'un batch égale à 1, alors…"], o: [["One iteration completes an epoch", "Il faudra une seule itération pour compléter une époque"], ["Two iterations complete an epoch", "Il faudra deux itérations pour compléter une époque"], ["100 iterations complete an epoch", "Il faudra 100 itérations pour compléter une époque"], ["None of these is correct", "Aucune réponse n'est correcte"]], a: [2], w: ["⌈100 / 1⌉ = 100 updates per epoch (that is SGD).", "⌈100 / 1⌉ = 100 mises à jour par époque (c'est la SGD)."] },
  { id: "Ch2 Q1", s: "Course quiz", t: "conv", m: false, q: ["Why add a pooling layer when building a CNN?", "Quel est l'intérêt d'ajouter une couche de Pooling lors de la création d'un réseau de neurones convolutif ?"], o: [["Reduce the size of the feature maps", "Réduire la taille de Feature maps"], ["Extract the image features", "Extraire les descripteurs de l'image"], ["Build a model", "Construire un modèle"], ["Get variable-length data", "Obtenir des données de longueur variable"]], a: [0], w: ["Convolution extracts, pooling reduces, FC builds the model. Pooling gives fixed-length data, not variable.", "La convolution extrait, le pooling réduit, le FC construit le modèle. Le pooling donne des données de longueur fixe."] },
  { id: "Ch2 Q2", s: "Course quiz", t: "arch", m: false, q: ["Which of these can be the input of a fully connected layer?", "Parmi les éléments suivants, lequel peut être l'entrée de la couche « Fully connected » ?"], o: [["A 2D vector of variable size", "Un vecteur 2D de taille variable"], ["A 1D vector of variable size", "Un vecteur 1D de taille variable"], ["A 2D vector of fixed size", "Un vecteur 2D de taille fixe"], ["A 1D vector of fixed size", "Un vecteur 1D de taille fixe"]], a: [3], w: ["Flatten or global pooling gives a fixed-size 1D vector.", "Flatten ou le pooling global donne un vecteur 1D de taille fixe."] },
  { id: "Ch2 Q3", s: "Course quiz", t: "conv", m: false, q: ["CNNs automatically extract high-level features from images.", "Les réseaux de neurones convolutifs permettent d'extraire automatiquement des descripteurs de hauts niveaux à partir des images."], o: VF, a: [0], w: ["Pixels → edges → parts → objects, all learned.", "Pixels → contours → parties → objets, tout est appris."] },
  // ---------------- Practice (tutor set, built from the course) ----------------
  { id: "P1", s: "Practice", t: "perc", m: false, q: ["A simple perceptron is trained on 500 observations described by 12 features. How many parameters does it learn?", "Un perceptron simple est entraîné sur 500 observations décrites par 12 descripteurs. Combien de paramètres apprend-il ?"], o: ["12", "13", "500", "6012"], a: [1], w: ["12 weights + 1 bias.", "12 poids + 1 biais."] },
  { id: "P2", s: "Practice", t: "batch", m: false, q: ["N = 1000, batch_size = 50. Iterations per epoch?", "N = 1000, batch_size = 50. Itérations par époque ?"], o: ["50", "20", "1000", "1"], a: [1], w: "⌈1000 / 50⌉ = 20." },
  { id: "P3", s: "Practice", t: "batch", m: false, q: ["N = 54,000, batch_size = 32, 10 epochs. Total iterations?", "N = 54 000, batch_size = 32, 10 époques. Itérations au total ?"], o: ["1688", "16,875", "16,880", "540,000"], a: [2], w: ["⌈54000 / 32⌉ = ⌈1687.5⌉ = 1688 per epoch, × 10 = 16,880. 16,875 forgets the last partial batch.", "⌈54000 / 32⌉ = ⌈1687.5⌉ = 1688 par époque, × 10 = 16 880. 16 875 oublie le dernier batch incomplet."] },
  { id: "P4", s: "Practice", t: "batch", m: true, q: ["Which statements about gradient descent are correct?", "Quelles affirmations sur la descente de gradient sont correctes ?"], o: [["BGD uses all observations for each update", "BGD utilise toutes les observations à chaque mise à jour"], ["SGD is fast but unstable", "SGD est rapide mais instable"], ["BGD is fast and reliable", "BGD est rapide et fiable"], ["MBGD converges faster than BGD", "MBGD converge plus vite que BGD"]], a: [0, 1, 3], w: ["BGD is stable but slow.", "BGD est stable mais lent."] },
  { id: "P5", s: "Practice", t: "perc", m: false, q: ["XOR can be solved with a simple perceptron.", "XOR peut être résolu par un perceptron simple."], o: VF, a: [1], w: ["Not linearly separable: you need hidden layers (MLP).", "Non linéairement séparable : il faut des couches cachées (PMC)."] },
  { id: "P6", s: "Practice", t: "perc", m: false, q: ["Heaviside perceptron, w1 = 1, w2 = −1, b = 0, η = 1. Input (0,0), d = 0. After the update:", "Perceptron Heaviside, w1 = 1, w2 = −1, b = 0, η = 1. Entrée (0,0), d = 0. Après la mise à jour :"], o: ["b = 0", "b = −1", "b = 1", "w1 = 0"], a: [1], w: ["Y = 0 → output 1; d − output = −1; only b moves (x1 = x2 = 0).", "Y = 0 → sortie 1 ; d − sortie = −1 ; seul b bouge (x1 = x2 = 0)."] },
  { id: "P7", s: "Practice", t: "perc", m: false, q: ["Same rule. Input (0,1), d = 1, with w = (1, −1), b = −1. New weights?", "Même règle. Entrée (0,1), d = 1, avec w = (1, −1), b = −1. Nouveaux poids ?"], o: ["(1, 0), b = 0", "(1, −1), b = −1", "(2, 0), b = 0", "(1, 0), b = −1"], a: [0], w: ["Y = −2 → output 0; error +1; w2 = −1 + 1 = 0, b = −1 + 1 = 0. w1 stays (x1 = 0).", "Y = −2 → sortie 0 ; erreur +1 ; w2 = −1 + 1 = 0, b = −1 + 1 = 0. w1 reste (x1 = 0)."] },
  { id: "P8", s: "Practice", t: "mlp", m: false, q: ["Which activation gives outputs that sum to 1?", "Quelle activation donne des sorties dont la somme vaut 1 ?"], o: ["sigmoid", "ReLU", "softmax", "softplus"], a: [2], w: ["Softmax, for the multi-class output.", "Softmax, pour la sortie multi-classe."] },
  { id: "P9", s: "Practice", t: "mlp", m: false, q: ["The derivative of the sigmoid is:", "La dérivée de la sigmoïde est :"], o: ["f(1 + f)", "f(1 − f)", ["1 if Y ≥ 0, else 0", "1 si Y ≥ 0, sinon 0"], "ln(1 + e^Y)"], a: [1], w: ["Its maximum is 0.25, at Y = 0.", "Son maximum est 0.25, en Y = 0."] },
  { id: "P10", s: "Practice", t: "mlp", m: false, q: ["The derivative of softplus ln(1 + e^Y) is:", "La dérivée de softplus ln(1 + e^Y) est :"], o: ["ReLU", "sigmoid", "tanh", "1"], a: [1], w: ["e^Y / (1 + e^Y) = sigmoid.", "e^Y / (1 + e^Y) = sigmoïde."] },
  { id: "P11", s: "Practice", t: "mlp", m: false, q: ["Range of ReLU?", "Intervalle de ReLU ?"], o: ["]0, 1[", "[0, +∞[", "]−∞, +∞[", "]−α, +∞["], a: [1], w: ["Leaky ReLU: ]−∞, +∞[. ELU: ]−α, +∞[. Sigmoid: ]0, 1[.", "Leaky ReLU : ]−∞, +∞[. ELU : ]−α, +∞[. Sigmoïde : ]0, 1[."] },
  { id: "P12", s: "Practice", t: "gd", m: false, q: ["Binary classification with 1 sigmoid output neuron. Which loss?", "Classification binaire avec 1 neurone de sortie sigmoïde. Quelle perte ?"], o: ["MSE", "binary cross-entropy", "sparse categorical CE", "categorical CE"], a: [1], w: ["Binary → BCE.", "Binaire → BCE."] },
  { id: "P13", s: "Practice", t: "gd", m: false, q: ["Fashion-MNIST labels are integers 0–9 with a 10-neuron softmax output. Which loss does TP1 use?", "Les étiquettes Fashion-MNIST sont des entiers 0–9 avec une sortie softmax à 10 neurones. Quelle perte utilise le TP1 ?"], o: ["`binary_crossentropy`", "`sparse_categorical_crossentropy`", "`categorical_crossentropy`", "`mse`"], a: [1], w: ["Integer labels → sparse. One-hot labels would need `categorical_crossentropy`.", "Étiquettes entières → sparse. Des étiquettes one-hot demanderaient `categorical_crossentropy`."] },
  { id: "P14", s: "Practice", t: "arch", m: false, q: ["Parameters of Dense(128) after Flatten of a 28×28 input?", "Paramètres de Dense(128) après Flatten d'une entrée 28×28 ?"], o: ["100,352", "100,480", "784", "16,512"], a: [1], w: ["784·128 + 128 = 100,480. 100,352 forgets the biases.", "784·128 + 128 = 100 480. 100 352 oublie les biais."] },
  { id: "P15", s: "Practice", t: "arch", m: false, q: ["Input 64×64×3, Conv2D(120, 5×5, stride 1, valid). Output shape?", "Entrée 64×64×3, Conv2D(120, 5×5, pas 1, valid). Forme de sortie ?"], o: ["64×64×120", "60×60×120", "60×60×3", "59×59×120"], a: [1], w: ["(64 − 5 + 0)/1 + 1 = 60; depth = number of filters.", "(64 − 5 + 0)/1 + 1 = 60 ; profondeur = nombre de filtres."] },
  { id: "P16", s: "Practice", t: "arch", m: false, q: ["Parameters of that layer (P15)?", "Paramètres de cette couche (P15) ?"], o: ["3,000", "9,000", "9,120", "3,120"], a: [2], w: ["(5·5·3 + 1)·120 = 9,120. 9,000 forgets the bias; 3,000 forgets C_in.", "(5·5·3 + 1)·120 = 9 120. 9 000 oublie le biais ; 3 000 oublie C_in."] },
  { id: "P17", s: "Practice", t: "arch", m: false, q: ["Input 60×60×120, Conv2D(200, 3×3, same, stride 1). Output and parameters?", "Entrée 60×60×120, Conv2D(200, 3×3, same, pas 1). Sortie et paramètres ?"], o: ["60×60×200; 216,200", "58×58×200; 216,000", "60×60×200; 1,800", "60×60×120; 216,200"], a: [0], w: ["same + stride 1 keeps 60×60; (3·3·120 + 1)·200 = 216,200.", "same + pas 1 garde 60×60 ; (3·3·120 + 1)·200 = 216 200."] },
  { id: "P18", s: "Practice", t: "conv", m: false, q: ["Input 227×227×3, conv with 96 filters 11×11, stride 4, valid. Output H?", "Entrée 227×227×3, conv à 96 filtres 11×11, pas 4, valid. H de sortie ?"], o: ["55", "54", "56", "57"], a: [0], w: "(227 − 11)/4 + 1 = 55 (AlexNet)." },
  { id: "P19", s: "Practice", t: "conv", m: false, q: ["MaxPooling2D(2×2, stride 2) on 13×13×5 gives:", "MaxPooling2D(2×2, pas 2) sur 13×13×5 donne :"], o: ["6×6×5", "7×7×5", "6×6×2", "13×13×5"], a: [0], w: ["floor(13/2) = 6; depth unchanged; 0 parameters.", "floor(13/2) = 6 ; profondeur inchangée ; 0 paramètre."] },
  { id: "P20", s: "Practice", t: "conv", m: false, q: ["Padding P that keeps the size with a 5×5 kernel and stride 1 ('same')?", "Padding P qui garde la taille avec un noyau 5×5 et un pas 1 ('same') ?"], o: ["1", "2", "5", "0"], a: [1], w: "P = (5 − 1)/2 = 2." },
  { id: "P21", s: "Practice", t: "conv", m: false, q: ["Max pooling 2×2, stride 2 of `[[25,8,9,48],[56,1,5,6],[35,255,0,4],[12,2,32,2]]`?", "Max pooling 2×2, pas 2 de `[[25,8,9,48],[56,1,5,6],[35,255,0,4],[12,2,32,2]]` ?"], o: ["[[56, 48], [255, 32]]", "[[22.5, 17], [76, 9.5]]", "[[56, 9], [255, 4]]", "[[25, 48], [35, 32]]"], a: [0], w: ["Max of each 2×2 block. Option b is average pooling.", "Max de chaque bloc 2×2. L'option b est le pooling moyen."] },
  { id: "P22", s: "Practice", t: "conv", m: true, q: ["The role of pooling is to:", "Le rôle du pooling est de :"], o: [["Reduce the feature-map size", "Réduire la taille des feature maps"], ["Add learnable weights", "Ajouter des poids à apprendre"], ["Give invariance to small translations", "Donner une invariance aux petites translations"], ["Reduce overfitting risk and computation", "Réduire le risque de sur-apprentissage et le calcul"]], a: [0, 2, 3], w: ["Pooling has 0 parameters.", "Le pooling a 0 paramètre."] },
  { id: "P23", s: "Practice", t: "arch", m: false, q: ["GlobalMaxPooling on 5×5×64 gives:", "GlobalMaxPooling sur 5×5×64 donne :"], o: ["25", "64", "1600", "5×5"], a: [1], w: ["One value per channel: a 1D vector of 64.", "Une valeur par canal : un vecteur 1D de 64."] },
  { id: "P24", s: "Practice", t: "conv", m: false, q: ["Default padding of Keras `Conv2D`?", "Padding par défaut de `Conv2D` dans Keras ?"], o: ["same", "valid", "full", "causal"], a: [1], w: ["Defaults: kernel (3,3), strides (1,1), padding 'valid', activation None.", "Défauts : noyau (3,3), strides (1,1), padding 'valid', activation None."] },
  { id: "P25a", s: "Practice", t: "eval", m: false, q: ["Confusion matrix, rows = desired: class A row [80, 20], class B row [10, 90]. Recall of A?", "Matrice de confusion, lignes = désirées : ligne A [80, 20], ligne B [10, 90]. Rappel de A ?"], o: ["0.80", "0.889", "0.85", "0.90"], a: [0], w: ["Divide by the row: 80 / 100.", "On divise par la ligne : 80 / 100."] },
  { id: "P25b", s: "Practice", t: "eval", m: false, q: ["Same matrix. Precision of A?", "Même matrice. Précision de A ?"], o: ["0.80", "0.889", "0.85", "0.90"], a: [1], w: ["Divide by the column: 80 / (80 + 10). Accuracy = 170 / 200 = 0.85.", "On divise par la colonne : 80 / (80 + 10). Exactitude = 170 / 200 = 0.85."] },
  { id: "P26", s: "Practice", t: "batch", m: true, q: ["Which are hyperparameters?", "Lesquels sont des hyperparamètres ?"], o: [["Learning rate", "Taux d'apprentissage"], ["The weights", "Les poids"], "batch_size", ["Number of hidden layers", "Nombre de couches cachées"], ["The bias", "Le biais"]], a: [0, 2, 3], w: ["Weights and biases are learned parameters.", "Poids et biais sont des paramètres appris."] },
  { id: "P27", s: "Practice", t: "eval", m: false, q: ["Training loss keeps decreasing while val_loss increases. This is:", "La perte d'entraînement baisse toujours tandis que val_loss augmente. C'est :"], o: [["Underfitting", "Sous-apprentissage"], ["Overfitting", "Sur-apprentissage"], "Convergence", ["Vanishing gradient", "Gradient évanescent"]], a: [1], w: ["Underfitting = both errors high.", "Sous-apprentissage = les deux erreurs élevées."] },
  { id: "P28", s: "Practice", t: "batch", m: false, q: ["Adam combines:", "Adam combine :"], o: ["AdaGrad + AdaDelta", "Momentum + RMSProp", "SGD + BGD", "Momentum + AdaGrad"], a: [1], w: ["RMSProp = AdaGrad with a moving average.", "RMSProp = AdaGrad avec une moyenne mobile."] },
  { id: "P29", s: "Practice", t: "arch", m: false, q: ["In AlexNet, most parameters are in:", "Dans AlexNet, la plupart des paramètres sont dans :"], o: [["The conv layers", "Les couches de convolution"], ["The pooling layers", "Les couches de pooling"], ["The fully connected layers", "Les couches entièrement connectées"], ["The input", "L'entrée"]], a: [2], w: ["About 94% of 62.37 M.", "Environ 94 % de 62.37 M."] },
  { id: "P30", s: "Practice", t: "intro", m: false, q: ["DL learns high-level features end-to-end, while classic ML relies on manual feature extraction.", "Le DL apprend des descripteurs de haut niveau de bout en bout, alors que le ML classique repose sur une extraction manuelle."], o: VF, a: [0], w: ["ML vs DL slide.", "Slide ML vs DL."] },
  { id: "P32", s: "Practice", t: "arch", m: false, q: ["Total parameters of the TP1 model (784 → 128 → 128 → 64 → 10)?", "Paramètres au total du modèle du TP1 (784 → 128 → 128 → 64 → 10) ?"], o: ["125,898", "125,568", "100,480", "16,512"], a: [0], w: ["100,480 + 16,512 + 8,256 + 650. 125,568 forgets the biases.", "100 480 + 16 512 + 8 256 + 650. 125 568 oublie les biais."] },
  // ---------------- Lesson checks ----------------
  { id: "L1", s: "Lesson check", t: "intro", m: true, q: ["Which are uses of unsupervised learning in the course?", "Quelles sont les utilisations de l'apprentissage non supervisé dans le cours ?"], o: ["Clustering", ["Dimensionality reduction", "Réduction de dimensionnalité"], ["Anomaly detection", "Détection d'anomalies"], "Classification"], a: [0, 1, 2], w: ["Classification needs labels: supervised.", "La classification demande des étiquettes : supervisé."] },
  { id: "L2", s: "Lesson check", t: "intro", m: false, q: ["An agent observes a state, acts and receives a reward. This is…", "Un agent observe un état, agit et reçoit une récompense. C'est…"], o: [["Supervised", "Supervisé"], ["Semi-supervised", "Semi-supervisé"], ["Reinforcement", "Par renforcement"], ["Unsupervised", "Non supervisé"]], a: [2], w: "State → Action → Reward." },
  { id: "L3", s: "Lesson check", t: "perc", m: false, q: ["With positive inputs, when the output is above d, the weights…", "Avec des entrées positives, quand la sortie dépasse d, les poids…"], o: [["Increase", "Augmentent"], ["Decrease", "Diminuent"], ["Stay the same", "Restent identiques"], ["Reset to 0", "Reviennent à 0"]], a: [1], w: ["d − output = −1, so w ← w − η·x.", "d − sortie = −1, donc w ← w − η·x."] },
  { id: "L4", s: "Lesson check", t: "perc", m: true, q: ["Which are stopping conditions in the course?", "Lesquelles sont des conditions d'arrêt du cours ?"], o: [["Weights stable for one full epoch", "Poids stables pendant une époque complète"], ["Global error stops decreasing", "L'erreur globale ne diminue plus"], ["Maximum number of iterations reached", "Nombre maximal d'itérations atteint"], ["Test accuracy reaches 50%", "L'exactitude de test atteint 50 %"]], a: [0, 1, 2], w: ["Also: an error threshold, a fixed number of epochs.", "Aussi : un seuil d'erreur, un nombre d'époques fixé."] },
  { id: "L19", s: "Lesson check", t: "perc", m: false, q: ["Slide 40 activity: the weights stay b = −0.3, w = (0.2, 2, −0.1) for all of epoch 2 (iterations 11–20). When did it converge?", "Activité slide 40 : les poids restent b = −0.3, w = (0.2, 2, −0.1) pendant toute l'époque 2 (itérations 11–20). Quand a-t-il convergé ?"], o: [["Iteration 10", "Itération 10"], ["Iteration 20", "Itération 20"], ["Iteration 21", "Itération 21"], ["Iteration 11", "Itération 11"]], a: [0], w: ["Stable for a whole epoch after iteration 10 (tutor answer).", "Stables pendant une époque entière après l'itération 10 (réponse du tuteur)."] },
  { id: "L5", s: "Lesson check", t: "mlp", m: false, q: ["An MLP for Fashion-MNIST (784 pixels, 10 classes): input / output neurons?", "Un PMC pour Fashion-MNIST (784 pixels, 10 classes) : neurones d'entrée / de sortie ?"], o: ["784 / 10", "10 / 784", "28 / 10", "784 / 1"], a: [0], w: ["Input = number of features, output = number of classes.", "Entrée = nombre de descripteurs, sortie = nombre de classes."] },
  { id: "L6", s: "Lesson check", t: "mlp", m: false, q: ["'Deep' in deep learning refers to…", "« Profond » dans apprentissage profond désigne…"], o: [["The number of hidden layers", "Le nombre de couches cachées"], ["The number of input neurons", "Le nombre de neurones d'entrée"], ["The dataset size", "La taille du dataset"], ["The number of epochs", "Le nombre d'époques"]], a: [0], w: ["Many hidden layers.", "Beaucoup de couches cachées."] },
  { id: "L7", s: "Lesson check", t: "gd", m: false, q: ["If the learning rate η is too large…", "Si le taux d'apprentissage η est trop grand…"], o: [["Convergence is just slower", "La convergence est juste plus lente"], ["The updates jump from side to side and can diverge", "Les mises à jour sautent d'un côté à l'autre et peuvent diverger"], ["It always finds the global minimum", "Il trouve toujours le minimum global"], ["Nothing changes", "Rien ne change"]], a: [1], w: ["Too small = slow. The course recommends η = 0.001.", "Trop petit = lent. Le cours recommande η = 0.001."] },
  { id: "L8", s: "Lesson check", t: "gd", m: false, q: ["∂E/∂w > 0. After one step w ← w − η·∂E/∂w, w…", "∂E/∂w > 0. Après un pas w ← w − η·∂E/∂w, w…"], o: [["Increases", "Augmente"], ["Decreases", "Diminue"], ["Is unchanged", "Ne change pas"], ["Becomes η", "Devient η"]], a: [1], w: ["Positive gradient → move left.", "Gradient positif → on va à gauche."] },
  { id: "L9", s: "Lesson check", t: "gd", m: false, q: ["Layer with 3 inputs and 4 neurons: shape of W?", "Couche à 3 entrées et 4 neurones : forme de W ?"], o: ["(4, 3)", "(3, 4)", "(4, 1)", "(1, 4)"], a: [0], w: ["W is (#out, #in).", "W est (#sorties, #entrées)."] },
  { id: "L10", s: "Lesson check", t: "gd", m: false, q: ["Slide example: W = [[1,2,2],[−2,0,−2],[−1,−1,1]], X = (0.1, −0.2, −0.5). W·X = ?", "Exemple du cours : W = [[1,2,2],[−2,0,−2],[−1,−1,1]], X = (0.1, −0.2, −0.5). W·X = ?"], o: ["(−1.3, 0.8, −0.4)", "(1.3, −0.8, 0.4)", "(−0.1, 0.8, −0.6)", "(−1.3, 1.2, −0.4)"], a: [0], w: ["Row by row: 0.1 − 0.4 − 1.0; −0.2 + 0 + 1.0; −0.1 + 0.2 − 0.5 (tutor computation).", "Ligne par ligne : 0.1 − 0.4 − 1.0 ; −0.2 + 0 + 1.0 ; −0.1 + 0.2 − 0.5 (calcul du tuteur)."] },
  { id: "L20", s: "Lesson check", t: "batch", m: false, q: ["TP2: 4241 training images, batch 64. Iterations per epoch?", "TP2 : 4241 images d'entraînement, batch 64. Itérations par époque ?"], o: ["66", "67", "64", "4241"], a: [1], w: ["⌈4241 / 64⌉ = ⌈66.3⌉ = 67 (tutor computation).", "⌈4241 / 64⌉ = ⌈66.3⌉ = 67 (calcul du tuteur)."] },
  { id: "L11", s: "Lesson check", t: "eval", m: false, q: ["TP1 confusion matrix: Shirt row sum 1000, diagonal 680. Recall of Shirt?", "Matrice de confusion TP1 : ligne Shirt = 1000, diagonale 680. Rappel de Shirt ?"], o: ["0.68", "0.74", "0.71", "0.89"], a: [0], w: ["680 / 1000. 0.74 is its precision (680 / 923), 0.71 its F1.", "680 / 1000. 0.74 est sa précision (680 / 923), 0.71 son F1."] },
  { id: "L12", s: "Lesson check", t: "eval", m: false, q: ["Keras lifecycle order?", "Ordre du cycle de vie Keras ?"], o: ["define → compile → fit → evaluate → predict", "define → fit → compile → predict → evaluate", "compile → define → fit → evaluate → predict", "define → compile → predict → fit → evaluate"], a: [0], w: ["`fit` returns `history`; `evaluate` returns [loss, metric].", "`fit` renvoie `history` ; `evaluate` renvoie [loss, metric]."] },
  { id: "L18", s: "Lesson check", t: "eval", m: false, q: ["Two classes: sensitivity = ?", "Deux classes : sensibilité = ?"], o: ["TP / (TP + FN)", "TN / (TN + FP)", "TP / (TP + FP)", "(TP + TN) / n"], a: [0], w: ["Recall of the positive class. b is specificity, c precision, d accuracy.", "Rappel de la classe positive. b est la spécificité, c la précision, d l'exactitude."] },
  { id: "L13", s: "Lesson check", t: "conv", m: false, q: ["'same' padding for a 3×3 kernel, stride 1: P = ?", "Padding 'same' pour un noyau 3×3, pas 1 : P = ?"], o: ["0", "1", "2", "3"], a: [1], w: "P = (3 − 1)/2 = 1." },
  { id: "L14", s: "Lesson check", t: "conv", m: false, q: ["Slide 84 convolution (5×5 image, X-shaped 3×3 filter, valid, stride 1): value at row 2, column 1 of the feature map?", "Convolution slide 84 (image 5×5, filtre 3×3 en X, valid, pas 1) : valeur ligne 2, colonne 1 de la feature map ?"], o: ["2", "3", "4", "1"], a: [0], w: ["Feature map [[4,3,4],[2,4,3],[2,3,4]] (tutor computation). Try it in the visual.", "Feature map [[4,3,4],[2,4,3],[2,3,4]] (calcul du tuteur). Essayez dans le visuel."] },
  { id: "L17", s: "Lesson check", t: "conv", m: false, q: ["Average pooling 2×2/2 of the course matrix: top-left value?", "Pooling moyen 2×2/2 de la matrice du cours : valeur en haut à gauche ?"], o: ["22.5", "56", "90", "25"], a: [0], w: ["(25 + 8 + 56 + 1) / 4 = 22.5.", "(25 + 8 + 56 + 1) / 4 = 22.5."] },
  { id: "L15", s: "Lesson check", t: "arch", m: false, q: ["Slide 95: Conv2D(64, 3×3, valid) on 13×13×200. Output and parameters?", "Slide 95 : Conv2D(64, 3×3, valid) sur 13×13×200. Sortie et paramètres ?"], o: ["11×11×64; 115,264", "13×13×64; 115,264", "11×11×64; 1,792", "11×11×200; 115,200"], a: [0], w: "(13 − 3)/1 + 1 = 11; (3·3·200 + 1)·64 = 115,264." },
  { id: "L16", s: "Lesson check", t: "arch", m: false, q: ["`ModelCheckpoint(..., save_best_only=True)` keeps…", "`ModelCheckpoint(..., save_best_only=True)` garde…"], o: [["Only the best model according to `monitor`", "Seulement le meilleur modèle selon `monitor`"], ["One file per epoch", "Un fichier par époque"], ["The last model only", "Le dernier modèle seulement"], ["Only the optimizer state", "Seulement l'état de l'optimiseur"]], a: [0], w: ["`.keras` = whole model (`load_model`); `.weights.h5` = weights only (`load_weights`).", "`.keras` = modèle entier (`load_model`) ; `.weights.h5` = poids seuls (`load_weights`)."] },
  { id: "L21", s: "Lesson check", t: "arch", m: false, q: ["TP2: Flatten after MaxPool on 13×13×5 gives a vector of size…", "TP2 : Flatten après MaxPool sur 13×13×5 donne un vecteur de taille…"], o: ["180", "845", "245", "36"], a: [0], w: ["Pool → 6×6×5, then 6·6·5 = 180 (tutor computation).", "Pool → 6×6×5, puis 6·6·5 = 180 (calcul du tuteur)."] },
];

var MOCK = {
  A: ["P1", "P2", "P3", "P4", "P5", "P6", "P8", "P9", "P11", "P12", "P14", "P15", "P16", "P19", "P20", "P21", "P25a", "P27", "P28", "P30"],
  B: ["Intro Q2", "Intro Q3", "Ch1 Q1", "Ch1 Q2", "P7", "P10", "P13", "Ch1 Q5", "Ch1 Q6", "P17", "P18", "P22", "Ch2 Q1", "Ch2 Q2", "P23", "P24", "P25b", "P26", "P29", "P32"],
};
var OR_DATA = [[0, 0, 0], [0, 1, 1], [1, 0, 1], [1, 1, 1]];
var IMG = [[1, 1, 1, 0, 0], [0, 1, 1, 1, 0], [0, 0, 1, 1, 1], [0, 0, 1, 1, 0], [0, 1, 1, 0, 0]];
var KER = [[1, 0, 1], [0, 1, 0], [1, 0, 1]];
var POOL = [[25, 8, 9, 48], [56, 1, 5, 6], [35, 255, 0, 4], [12, 2, 32, 2]];
var ARCH = {
  tp1: { name: ["TP1 MLP (official correction)", "PMC du TP1 (correction officielle)"], note: ["Official `summary()`: total 125,898, all trainable.", "`summary()` officiel : total 125 898, tous entraînables."], layers: [
    { n: "Input", out: "28×28", p: 0, f: "" }, { n: "Flatten", out: "784", p: 0, f: "0" }, { n: "Dense 128 relu", out: "128", p: 100480, f: "(784 + 1)·128" }, { n: "Dense 128 relu", out: "128", p: 16512, f: "(128 + 1)·128" }, { n: "Dense 64 relu", out: "64", p: 8256, f: "(128 + 1)·64" }, { n: "Dense 10 softmax", out: "10", p: 650, f: "(64 + 1)·10" }] },
  tp2: { name: ["TP2 CNN (tutor solution)", "CNN du TP2 (solution du tuteur)"], note: ["No official TP2 correction exists: these values are the tutor's computation (total 42,634).", "Il n'existe pas de correction officielle du TP2 : valeurs calculées par le tuteur (total 42 634)."], layers: [
    { n: "Input + Rescaling", out: "28×28×3", p: 0, f: "" }, { n: "Conv 20, 3×3, valid", out: "26×26×20", p: 560, f: "(3·3·3 + 1)·20" }, { n: "MaxPool 2×2", out: "13×13×20", p: 0, f: "0" }, { n: "Conv 10, 3×3, same", out: "13×13×10", p: 1810, f: "(3·3·20 + 1)·10" }, { n: "Conv 5, 3×3, same", out: "13×13×5", p: 455, f: "(3·3·10 + 1)·5" }, { n: "MaxPool 2×2", out: "6×6×5", p: 0, f: "floor(13/2) = 6" }, { n: "Flatten", out: "180", p: 0, f: "6·6·5" }, { n: "Dense 128", out: "128", p: 23168, f: "(180 + 1)·128" }, { n: "Dense 128", out: "128", p: 16512, f: "(128 + 1)·128" }, { n: "Dense 1 sigmoid", out: "1", p: 129, f: "(128 + 1)·1" }] },
  s95: { name: ["Slide 95 exercise (tutor solution)", "Exercice slide 95 (solution du tuteur)"], note: ["Tutor solution, assuming Block_1_1 is identical to Block_1_0 (total 1,174,315).", "Solution du tuteur, en supposant Block_1_1 identique à Block_1_0 (total 1 174 315)."], layers: [
    { n: "Input", out: "64×64×3", p: 0, f: "" }, { n: "Conv 120, 5×5, valid", out: "60×60×120", p: 9120, f: "(5·5·3 + 1)·120" }, { n: "Conv 200, 3×3, same", out: "60×60×200", p: 216200, f: "(3·3·120 + 1)·200" }, { n: "MaxPool 2×2", out: "30×30×200", p: 0, f: "0" }, { n: "Conv 120, 5×5, valid", out: "26×26×120", p: 600120, f: "(5·5·200 + 1)·120" }, { n: "Conv 200, 3×3, same", out: "26×26×200", p: 216200, f: "(3·3·120 + 1)·200" }, { n: "MaxPool 2×2", out: "13×13×200", p: 0, f: "0" }, { n: "Conv 64, 3×3, valid", out: "11×11×64", p: 115264, f: "(3·3·200 + 1)·64" }, { n: "MaxPool 2×2", out: "5×5×64", p: 0, f: "floor(11/2) = 5" }, { n: "GlobalMaxPool", out: "64", p: 0, f: ["one value per channel", "une valeur par canal"] }, { n: "Dense 256", out: "256", p: 16640, f: "(64 + 1)·256" }, { n: "Dense 3 softmax", out: "3", p: 771, f: "(256 + 1)·3" }] },
};

var CLS = ["T-shirt/top", "Trouser", "Pullover", "Dress", "Coat", "Sandal", "Shirt", "Sneaker", "Bag", "Ankle boot"];
var CM = [[846, 4, 24, 24, 3, 1, 91, 0, 7, 0], [5, 962, 8, 18, 4, 0, 2, 0, 1, 0], [11, 0, 832, 11, 79, 0, 64, 0, 3, 0], [32, 9, 12, 881, 44, 0, 14, 0, 8, 0], [1, 0, 118, 19, 787, 0, 69, 0, 6, 0], [0, 0, 0, 0, 0, 969, 0, 18, 2, 11], [144, 0, 86, 28, 49, 0, 680, 0, 13, 0], [0, 0, 0, 0, 0, 16, 0, 964, 1, 19], [3, 0, 3, 2, 2, 5, 2, 1, 982, 0], [0, 0, 0, 0, 0, 9, 1, 37, 0, 953]];
  /* ---------- visuals (ported from the canvas SVGs) ---------- */
  function nestSvg() {
    var f = fr();
    return svg("0 0 1000 300", "AI contains ML contains DL",
      '<rect x="10" y="10" width="980" height="280" rx="18" fill="' + C(0) + '"' + AA + ' stroke="' + C(0) + '"/>' +
      T(30, 46, f ? "IA (Intelligence Artificielle)" : "AI (artificial intelligence)", "sv-t", HEAD) +
      T(30, 70, f ? "Machines qui imitent l'intelligence humaine" : "Machines that imitate human intelligence", "sv-2", LAB) +
      '<rect x="300" y="60" width="670" height="210" rx="16" fill="' + C(1) + '"' + AA + ' stroke="' + C(1) + '"/>' +
      T(320, 94, f ? "ML (Apprentissage automatique)" : "ML (machine learning)", "sv-t", HEAD) +
      T(320, 118, f ? "Apprend des données sans programmation explicite" : "Learns from data without explicit programming", "sv-2", LAB) +
      '<rect x="600" y="140" width="350" height="110" rx="14" fill="' + C(2) + '"' + AA + ' stroke="' + C(2) + '"/>' +
      T(620, 174, f ? "DL (Apprentissage profond)" : "DL (deep learning)", "sv-t", HEAD) +
      T(620, 198, f ? "Réseaux de neurones profonds :" : "Deep neural networks:", "sv-2", LAB) +
      T(620, 220, f ? "beaucoup de couches cachées" : "many hidden layers", "sv-2", LAB));
  }

  function runOR() {
    var w = [1, -1, 0], out = [];
    for (var it = 1; it <= 13; it++) {
      var r = OR_DATA[(it - 1) % 4], x1 = r[0], x2 = r[1], d = r[2];
      var y = w[0] * x1 + w[1] * x2 + w[2], o = y >= 0 ? 1 : 0, e = d - o;
      w = [w[0] + e * x1, w[1] + e * x2, w[2] + e];
      out.push({ it: it, x1: x1, x2: x2, d: d, y: y, out: o, w: w });
    }
    return out;
  }
  var OR_STEPS = runOR();

  function neuronSvg(st, prev) {
    var f = fr(), h = "";
    var ins = [{ y: 50, n: "x1", v: st ? String(st.x1) : "·", w: "w1 = " + prev[0] }, { y: 130, n: "x2", v: st ? String(st.x2) : "·", w: "w2 = " + prev[1] }, { y: 210, n: f ? "1 (biais)" : "1 (bias)", v: "1", w: "b = " + prev[2] }];
    var ok = st ? st.out === st.d : true;
    ins.forEach(function (p) {
      h += '<line x1="150" y1="' + p.y + '" x2="450" y2="130" class="sv-axis" stroke-width="1.5"/>';
      h += '<circle cx="120" cy="' + p.y + '" r="28" fill="var(--surface)" stroke="' + C(0) + '" stroke-width="2"/>';
      h += T(120, p.y + 5, p.v, "sv-t", VAL + ' text-anchor="middle"') + T(70, p.y + 5, p.n, "sv-2", LAB + ' text-anchor="end"') + T(290, (p.y + 130) / 2 - 8, p.w, "sv-t", VAL + ' text-anchor="middle"');
    });
    h += '<circle cx="490" cy="130" r="42" fill="' + C(0) + '"' + AA + ' stroke="' + C(0) + '" stroke-width="2"/>';
    h += T(490, 124, "Σ", "sv-t", VAL + ' text-anchor="middle"') + T(490, 146, st ? "Y = " + st.y : "Y", "sv-2", LAB + ' text-anchor="middle"');
    h += '<line x1="532" y1="130" x2="620" y2="130" class="sv-axis" stroke-width="1.5"/>';
    h += '<rect x="620" y="95" width="130" height="70" rx="10" fill="var(--surface)" stroke="' + C(1) + '" stroke-width="2"/>';
    h += '<polyline points="640,145 685,145 685,115 730,115" fill="none" stroke="' + C(1) + '" stroke-width="2"/>';
    h += T(685, 186, f ? "marche : 1 si Y ≥ 0" : "step: 1 if Y ≥ 0", "sv-2", LAB + ' text-anchor="middle"');
    h += '<line x1="750" y1="130" x2="830" y2="130" class="sv-axis" stroke-width="1.5"/>';
    h += T(840, 124, st ? (f ? "sortie = " : "output = ") + st.out : (f ? "sortie" : "output"), "sv-t", VAL);
    h += T(840, 148, st ? "d = " + st.d : "d", "sv-2", LAB);
    if (st) h += '<text x="840" y="172" font-size="15" font-family="var(--font)" fill="' + (ok ? "var(--ok)" : "var(--ko)") + '">' + esc(ok ? (f ? "correct : pas de mise à jour" : "correct: no update") : (f ? "erreur d − sortie = " : "error d − output = ") + (st.d - st.out)) + "</text>";
    return svg("0 0 1000 260", "Perceptron", h);
  }
  Study.widgets.perc = function (b, ctx) {
    var n = Math.max(0, Math.min(13, parseInt(ctx.get("0"), 10) || 0)), k = ctx.key;
    var cur = n > 0 ? OR_STEPS[n - 1] : null, prev = n > 1 ? OR_STEPS[n - 2].w : [1, -1, 0];
    var h = neuronSvg(cur, prev);
    h += '<div class="ctl">' + Study.btn(L(["Previous step", "Pas précédent"]), "wset", k + "|" + Math.max(0, n - 1), "", n <= 0 ? " disabled" : "") +
      Study.btn(n === 0 ? L(["Start", "Démarrer"]) : L(["Next step", "Pas suivant"]), "wset", k + "|" + Math.min(13, n + 1), "primary", n >= 13 ? " disabled" : "") +
      Study.btn(L(["Show all 13", "Tout afficher (13)"]), "wset", k + "|13") + Study.btn(L(["Reset", "Recommencer"]), "wset", k + "|0") +
      '<span class="ctl-l">' + n + " / 13</span></div>";
    if (n > 0) {
      var rows = OR_STEPS.slice(0, n).map(function (s, i) {
        var before = i === 0 ? [1, -1, 0] : OR_STEPS[i - 1].w, changed = s.out !== s.d;
        return [String(s.it), s.x1 + " " + s.x2, String(s.d), String(s.y), String(s.out), String(s.d - s.out), changed ? { t: "(" + s.w.join(", ") + ")", tone: "warning" } : L(["no change", "inchangé"]) + " (" + before.join(", ") + ")"];
      });
      h += Study.block(tbl([["It.", "It."], "x1 x2", "d", "Y", "f(Y)", "d − f", ["w1, w2, b after", "w1, w2, b après"]], rows, { compact: true }), k + ".t");
    }
    h += '<p class="txt">' + esc(n >= 13 ? L(["Iterations 10–13: a full epoch with no correction, so it has converged. Final model w1 = 1, w2 = 1, b = −1, i.e. Y = x1 + x2 − 1.", "Itérations 10–13 : une époque complète sans correction, donc convergence. Modèle final w1 = 1, w2 = 1, b = −1, soit Y = x1 + x2 − 1."]) : L(["Rule: Y = w1·x1 + w2·x2 + b, output = 1 if Y ≥ 0, then wᵢ ← wᵢ + η(d − output)xᵢ and b ← b + η(d − output).", "Règle : Y = w1·x1 + w2·x2 + b, sortie = 1 si Y ≥ 0, puis wᵢ ← wᵢ + η(d − sortie)xᵢ et b ← b + η(d − sortie)."])) + "</p>";
    return h;
  };

  function sepSvg() {
    var f = fr();
    function panel(ox, title, cls, line, note) {
      function X(v) { return ox + 70 + v * 300; } function Y(v) { return 290 - v * 220; }
      var h = T(ox + 20, 30, title, "sv-t", VAL);
      h += '<line x1="' + X(-0.1) + '" y1="' + Y(0) + '" x2="' + X(1.15) + '" y2="' + Y(0) + '" class="sv-axis"/><line x1="' + X(0) + '" y1="' + Y(-0.1) + '" x2="' + X(0) + '" y2="' + Y(1.15) + '" class="sv-axis"/>';
      h += T(X(1.15), Y(0) + 20, "x1", "sv-2", LAB + ' text-anchor="end"') + T(X(0) - 10, Y(1.15), "x2", "sv-2", LAB + ' text-anchor="end"');
      if (line) h += '<line x1="' + X(-0.15) + '" y1="' + Y(1.15) + '" x2="' + X(1.15) + '" y2="' + Y(-0.15) + '" stroke="' + C(3) + '" stroke-width="2" stroke-dasharray="6 5"/>';
      [[0, 0], [0, 1], [1, 0], [1, 1]].forEach(function (p, i) {
        h += '<circle cx="' + X(p[0]) + '" cy="' + Y(p[1]) + '" r="12" fill="' + (cls[i] === 1 ? C(0) : "var(--surface)") + '" stroke="' + (cls[i] === 1 ? C(0) : "var(--text2)") + '" stroke-width="2"/>';
        h += T(X(p[0]) + 18, Y(p[1]) - 12, "(" + p[0] + "," + p[1] + ") → " + cls[i], "sv-2", LAB);
      });
      return h + T(ox + 20, 330, note, "sv-2", LAB);
    }
    return svg("0 0 1000 345", "OR vs XOR", panel(0, f ? "OU (OR) : séparable" : "OR: separable", [0, 1, 1, 1], true, f ? "Droite apprise : x1 + x2 − 1 = 0 (Y ≥ 0 → 1)" : "Learned line: x1 + x2 − 1 = 0 (Y ≥ 0 → 1)") +
      panel(500, f ? "XOR : non séparable" : "XOR: not separable", [0, 1, 1, 0], false, f ? "Aucune droite ne sépare les points pleins des vides" : "No single line splits filled from empty points"));
  }

  function sig(y) { return 1 / (1 + Math.exp(-y)); }
  var ACT = {
    sigmoid: { f: sig, d: function (y) { return sig(y) * (1 - sig(y)); } },
    relu: { f: function (y) { return Math.max(0, y); }, d: function (y) { return y < 0 ? 0 : 1; } },
    softplus: { f: function (y) { return Math.log(1 + Math.exp(y)); }, d: sig },
    leaky: { f: function (y) { return y < 0 ? 0.1 * y : y; }, d: function (y) { return y < 0 ? 0.1 : 1; } },
    elu: { f: function (y) { return y < 0 ? Math.exp(y) - 1 : y; }, d: function (y) { return y < 0 ? Math.exp(y) : 1; } }
  };
  var ACTINFO = {
    sigmoid: ["1 / (1 + e^−Y)", "]0, 1[", "f(Y)(1 − f(Y)), max 0.25 at Y = 0", ["Binary output (1 neuron)", "Sortie binaire (1 neurone)"]],
    relu: ["max(0, Y)", "[0, +∞[", ["0 if Y < 0, 1 if Y ≥ 0", "0 si Y < 0, 1 si Y ≥ 0"], ["Hidden layers", "Couches cachées"]],
    softplus: ["ln(e^Y + 1)", "]0, +∞[", "sigmoid(Y)", ["Smooth ReLU", "ReLU lisse"]],
    leaky: [["αY if Y < 0, else Y", "αY si Y < 0, sinon Y"], "]−∞, +∞[", ["α or 1", "α ou 1"], ["Avoids dead neurons", "Évite les neurones morts"]],
    elu: [["α(e^Y − 1) if Y < 0, else Y", "α(e^Y − 1) si Y < 0, sinon Y"], "]−α, +∞[", ["f(Y) + α if Y < 0, else 1", "f(Y) + α si Y < 0, sinon 1"], ["Smooth negative part", "Partie négative lisse"]]
  };
  Study.widgets.act = function (b, ctx) {
    var fn = ctx.get("sigmoid"); if (!ACT[fn]) fn = "sigmoid";
    var A = ACT[fn], f = fr();
    function X(v) { return 60 + ((v + 4) / 8) * 880; } function Y(v) { return 30 + ((4 - v) / 5.5) * 300; }
    function path(g) { var s = ""; for (var i = 0; i <= 400; i++) { var y = -4 + (8 * i) / 400, v = Math.max(-1.5, Math.min(4, g(y))); s += (i === 0 ? "M" : "L") + X(y).toFixed(1) + "," + Y(v).toFixed(1) + " "; } return s; }
    var h = "";
    [-1, 0, 1, 2, 3, 4].forEach(function (v) { h += '<line x1="' + X(-4) + '" x2="' + X(4) + '" y1="' + Y(v) + '" y2="' + Y(v) + '" class="' + (v === 0 ? "sv-axis" : "sv-grid") + '"/>' + T(50, Y(v) + 4, String(v), "sv-m", LAB + ' text-anchor="end"'); });
    [-4, -2, 0, 2, 4].forEach(function (v) { h += '<line x1="' + X(v) + '" x2="' + X(v) + '" y1="' + Y(4) + '" y2="' + Y(-1.5) + '" class="' + (v === 0 ? "sv-axis" : "sv-grid") + '"/>' + T(X(v), Y(-1.5) + 20, "Y = " + v, "sv-m", LAB + ' text-anchor="middle"'); });
    h += '<path d="' + path(A.d) + '" fill="none" stroke="' + C(1) + '" stroke-width="2.5" stroke-dasharray="7 5"/><path d="' + path(A.f) + '" fill="none" stroke="' + C(0) + '" stroke-width="3"/>';
    h += T(X(4) - 6, Math.max(Y(Math.min(4, A.f(4))) + 18, 48), "f(Y)", "sv-t", LAB + ' text-anchor="end"') + T(X(4) - 6, Y(A.d(4)) - 8, f ? "f′(Y) (pointillé)" : "f′(Y) (dashed)", "sv-t", LAB + ' text-anchor="end"');
    var x = ACTINFO[fn];
    return segRow(ctx.key, [["sigmoid", "Sigmoid"], ["relu", "ReLU"], ["softplus", "Softplus"], ["leaky", "Leaky ReLU"], ["elu", "ELU"]], fn) + svg("0 0 1000 370", "Activation function", h) +
      Study.block(PR([{ label: "f(Y)", value: x[0] }, { label: ["Range", "Intervalle"], value: x[1] }, { label: "f′(Y)", value: x[2] }, { label: ["Use", "Usage"], value: x[3] }]), ctx.key + ".p");
  };

  Study.widgets.gd = function (b, ctx) {
    var e = ctx.get("0.3"); if (["0.05", "0.3", "1.05"].indexOf(e) < 0) e = "0.3";
    var eta = Number(e), f = fr();
    function X(w) { return 60 + ((w + 6) / 12) * 880; } function Y(v) { return 30 + ((36 - v) / 36) * 280; }
    var curve = ""; for (var i = 0; i <= 200; i++) { var w = -6 + (12 * i) / 200; curve += (i === 0 ? "M" : "L") + X(w).toFixed(1) + "," + Y(w * w).toFixed(1) + " "; }
    var ws = [4]; for (var k = 0; k < 6; k++) ws.push(ws[k] - eta * 2 * ws[k]);
    var shown = ws.filter(function (x) { return Math.abs(x) <= 6; });
    var h = '<line x1="' + X(-6) + '" x2="' + X(6) + '" y1="' + Y(0) + '" y2="' + Y(0) + '" class="sv-axis"/>';
    [-6, -4, -2, 0, 2, 4, 6].forEach(function (v) { h += T(X(v), Y(0) + 20, "w = " + v, "sv-m", LAB + ' text-anchor="middle"'); });
    h += '<path d="' + curve + '" fill="none" stroke="' + C(3) + '" stroke-width="2"/>';
    shown.slice(1).forEach(function (w, i) { h += '<line x1="' + X(shown[i]) + '" y1="' + Y(shown[i] * shown[i]) + '" x2="' + X(w) + '" y2="' + Y(w * w) + '" stroke="' + C(0) + '" stroke-width="2"/>'; });
    shown.forEach(function (w, i) { h += '<circle cx="' + X(w) + '" cy="' + Y(w * w) + '" r="7" fill="' + C(0) + '"/>' + T(X(w), Y(w * w) - 12, "w" + i, "sv-t", LAB + ' text-anchor="middle"'); });
    h += T(X(0), Y(0) - 10, "minimum", "sv-m", LAB + ' text-anchor="middle"') + T(X(-6), 22, f ? "E(w) = w² (courbe illustrative), départ w0 = 4, w ← w − η·2w" : "E(w) = w² (illustrative curve), start w0 = 4, w ← w − η·2w", "sv-m", LAB);
    var txt = e === "0.05" ? ["Too small: many iterations and a long computation time.", "Trop petit : beaucoup d'itérations et un long temps de calcul."] : e === "0.3" ? ["Suitable: quick convergence to the minimum. The course recommends η = 0.001 in practice.", "Adapté : convergence rapide vers le minimum. Le cours recommande η = 0.001 en pratique."] : ["Too large: the updates jump from side to side and diverge.", "Trop grand : les mises à jour sautent d'un côté à l'autre et divergent."];
    return segRow(ctx.key, [["0.05", L(["η too small (0.05)", "η trop petit (0.05)"])], ["0.3", L(["η suitable (0.3)", "η adapté (0.3)"])], ["1.05", L(["η too large (1.05)", "η trop grand (1.05)"])]], e) + svg("0 0 1000 350", "Gradient descent", h) + '<p class="txt">' + esc(L(txt)) + "</p>";
  };

  var PRESETS = { tp1: ["54000", "32", "10"], tp2: ["4241", "64", "10"], q3: ["100", "1", "1"], p2: ["1000", "50", "1"], bgd: ["1000", "1000", "1"] };
  function batchStrip(n, bs) {
    var f = fr(), it = Math.max(1, Math.ceil(n / bs)), last = n - (it - 1) * bs, maxB = 40, draw = Math.min(it, maxB), Wd = 960;
    var unit = it <= maxB ? Wd / (n / bs) : Wd / maxB, x = 20, h = "";
    h += T(20, 20, (f ? "Une époque = " : "One epoch = ") + nf(n) + (f ? " observations, une case = un batch = une itération" : " observations, one block = one batch = one iteration") + (it > maxB ? (f ? " (40 premières affichées)" : " (first 40 shown)") : ""), "sv-m", LAB);
    for (var i = 0; i < draw; i++) {
      var isLast = it <= maxB && i === draw - 1, w = isLast ? unit * (last / bs) : unit;
      h += '<rect x="' + (x + 1).toFixed(1) + '" y="30" width="' + Math.max(2, w - 2).toFixed(1) + '" height="40" rx="3" fill="' + (isLast && last < bs ? C(1) : C(0)) + '"/>';
      x += w;
    }
    if (it <= maxB && last < bs) h += T(980, 92, (f ? "dernier batch : " : "last batch: ") + last, "sv-m", LAB + ' text-anchor="end"');
    return svg("0 0 1000 100", "Batches in one epoch", h);
  }
  Study.widgets.batch = function (b, ctx) {
    var s = ctx.get({}); if (typeof s !== "object" || !s) s = {};
    var p0 = s.p && PRESETS[s.p] ? s.p : "tp1", d = PRESETS[p0];
    var nS = s.n != null ? s.n : d[0], bS = s.b != null ? s.b : d[1], eS = s.e != null ? s.e : d[2];
    var n = Math.max(1, Math.floor(Number(nS) || 0)), bs = Math.max(1, Math.floor(Number(bS) || 0)), ep = Math.max(1, Math.floor(Number(eS) || 0)), itPer = Math.ceil(n / bs);
    var opts = [["tp1", "TP1 (54000 / 32)"], ["tp2", "TP2 (4241 / 64)"], ["q3", "Quiz (100 / 1)"], ["p2", "P2 (1000 / 50)"], ["bgd", "BGD (1000 / 1000)"]].map(function (o) { var p = PRESETS[o[0]]; return [o[0], o[1], JSON.stringify({ p: o[0], n: p[0], b: p[1], e: p[2] })]; });
    var h = segRow(ctx.key, opts, p0, "wobj");
    function inp(name, label, v) { return '<label class="ctl-l">' + esc(label) + ' <input type="number" min="1" class="num-in" name="' + name + '" value="' + esc(String(v)) + '" data-winput="' + esc(ctx.key) + '"></label>'; }
    h += '<div class="ctl">' + inp("n", L(["Observations N", "Observations N"]), nS) + inp("b", "batch_size", bS) + inp("e", L(["Epochs", "Époques"]), eS) + "</div>";
    h += batchStrip(n, bs);
    h += Study.block(PR([{ label: ["Iterations per epoch", "Itérations par époque"], value: "⌈" + nf(n) + " / " + bs + "⌉ = " + nf(itPer) }, { label: ["Last batch size", "Taille du dernier batch"], value: nf(n - (itPer - 1) * bs) }, { label: ["Total iterations", "Itérations au total"], value: nf(itPer) + " × " + ep + " = " + nf(itPer * ep) }, { label: ["Variant", "Variante"], value: bs === 1 ? "SGD" : bs >= n ? "BGD" : "MBGD (mini-batch)" }]), ctx.key + ".p");
    return h;
  };

  Study.widgets.cm = function (b, ctx) {
    var s = ctx.get({}); var ci = parseInt(typeof s === "object" && s && s.c != null ? s.c : "6", 10); if (!(ci >= 0 && ci < 10)) ci = 6;
    var rowS = CM[ci].reduce(function (x, y) { return x + y; }, 0), colS = CM.reduce(function (x, r) { return x + r[ci]; }, 0);
    var rec = CM[ci][ci] / rowS, prec = CM[ci][ci] / colS, f1 = (2 * prec * rec) / (prec + rec);
    var worst = CM[ci].map(function (v, j) { return { v: v, j: j }; }).filter(function (x) { return x.j !== ci; }).sort(function (x, y) { return y.v - x.v; })[0];
    var h = '<div class="tbl-wrap"><table class="heat"><thead><tr><th></th>' + CLS.map(function (c, j) { return '<th class="' + (j === ci ? "hl" : "") + '"><span>' + esc(c) + "</span></th>"; }).join("") + "</tr></thead><tbody>";
    CM.forEach(function (r, i) {
      h += '<tr><th class="' + (i === ci ? "hl" : "") + '">' + esc(CLS[i]) + "</th>" + r.map(function (v, j) {
        var p = Math.round(Math.min(1, v / 1000) * 85), on = i === ci || j === ci;
        return '<td class="' + (on ? "on" : "") + (p > 45 ? " dk" : "") + '" style="background:color-mix(in srgb, var(--c0) ' + p + '%, transparent)">' + v + "</td>";
      }).join("") + "</tr>";
    });
    h += "</tbody></table></div>";
    h += '<div class="ctl"><label class="ctl-l">' + esc(L(["Class", "Classe"])) + ' <select name="c" data-winput="' + esc(ctx.key) + '">' + CLS.map(function (c, i) { return '<option value="' + i + '"' + (i === ci ? " selected" : "") + ">" + esc(c) + "</option>"; }).join("") + "</select></label></div>";
    h += Study.block(PR([{ label: ["Recall (divide by the row)", "Rappel (diviser par la ligne)"], value: CM[ci][ci] + " / " + rowS + " = " + r2(rec) }, { label: ["Precision (divide by the column)", "Précision (diviser par la colonne)"], value: CM[ci][ci] + " / " + colS + " = " + r2(prec) }, { label: "F1 = 2PR / (P + R)", value: r2(f1) }, { label: ["Most confused with", "Le plus confondu avec"], value: CLS[worst.j] + " (" + worst.v + ")" }]), ctx.key + ".p");
    return h;
  };

  Study.widgets.fit = function (b, ctx) {
    var mode = ctx.get("over"); if (["under", "good", "over"].indexOf(mode) < 0) mode = "over";
    var f = fr();
    function X(e) { return 60 + ((e - 1) / 19) * 860; } function Y(v) { return 20 + (1 - v) * 260; }
    function tr0(e) { return mode === "under" ? 0.82 - 0.08 * (1 - Math.exp(-e / 5)) : mode === "good" ? 0.2 + 0.7 * Math.exp(-e / 4) : 0.08 + 0.8 * Math.exp(-e / 4); }
    function va0(e) { return mode === "under" ? 0.86 - 0.07 * (1 - Math.exp(-e / 5)) : mode === "good" ? 0.27 + 0.65 * Math.exp(-e / 4) : 0.33 + 0.6 * Math.exp(-e / 3) + 0.016 * Math.max(0, e - 7); }
    function p(g) { var s = ""; for (var e = 1; e <= 20; e += 0.25) s += (e === 1 ? "M" : "L") + X(e).toFixed(1) + "," + Y(g(e)).toFixed(1) + " "; return s; }
    var best = 1; for (var e = 1; e <= 20; e++) if (va0(e) < va0(best)) best = e;
    var h = "";
    [0, 0.5, 1].forEach(function (v) { h += '<line x1="' + X(1) + '" x2="' + X(20) + '" y1="' + Y(v) + '" y2="' + Y(v) + '" class="sv-grid"/>'; });
    h += T(X(1), 300, f ? "époque 1" : "epoch 1", "sv-m", LAB) + T(X(20), 300, f ? "époque 20" : "epoch 20", "sv-m", LAB + ' text-anchor="end"') + T(50, Y(0.5) + 4, f ? "erreur" : "loss", "sv-m", LAB + ' text-anchor="end"');
    if (mode === "over") h += '<line x1="' + X(best) + '" x2="' + X(best) + '" y1="' + Y(1) + '" y2="' + Y(0) + '" stroke="' + C(3) + '" stroke-dasharray="5 5"/>' + T(X(best) + 8, Y(0.95), f ? "meilleur modèle (min val_loss)" : "best model (min val_loss)", "sv-t", LAB);
    h += '<path d="' + p(tr0) + '" fill="none" stroke="' + C(0) + '" stroke-width="3"/><path d="' + p(va0) + '" fill="none" stroke="' + C(1) + '" stroke-width="3"/>';
    h += T(X(20) + 6, Y(tr0(20)) + 4, "train", "sv-t", LAB) + T(X(20) + 6, Y(va0(20)) + 4, "val", "sv-t", LAB);
    var txt = mode === "under" ? ["Both training and validation errors stay high.", "Les erreurs d'entraînement et de validation restent élevées."] : mode === "good" ? ["Both errors fall and stay close.", "Les deux erreurs baissent et restent proches."] : ["Training error keeps falling while validation error rises: stop at the best epoch (ModelCheckpoint).", "L'erreur d'entraînement baisse tandis que celle de validation remonte : garder la meilleure époque (ModelCheckpoint)."];
    return segRow(ctx.key, [["under", L(["Underfitting", "Sous-apprentissage"])], ["good", L(["Good fit", "Bon ajustement"])], ["over", L(["Overfitting", "Sur-apprentissage"])]], mode) + svg("0 0 1000 320", "Learning curves", h) + '<p class="txt">' + esc(L(txt)) + "</p>";
  };

  Study.widgets.conv = function (b, ctx) {
    var s0 = ctx.get({}); if (typeof s0 !== "object" || !s0) s0 = {};
    var padS = s0.pad === "same" ? "same" : "valid", sS = s0.s === "2" ? "2" : "1", sel = parseInt(s0.sel, 10) || 0;
    var pad = padS === "same" ? 1 : 0, s = Number(sS), f = fr(), N = 5 + 2 * pad, k = ctx.key;
    function isPad(r, q) { return r < pad || q < pad || r >= 5 + pad || q >= 5 + pad; }
    function at(r, q) { return isPad(r, q) ? 0 : IMG[r - pad][q - pad]; }
    var O = Math.floor((N - 3) / s) + 1;
    function ov(i, j) { var v = 0; for (var u = 0; u < 3; u++) for (var w = 0; w < 3; w++) v += KER[u][w] * at(i * s + u, j * s + w); return v; }
    var si = Math.min(sel, O * O - 1), r0 = Math.floor(si / O) * s, c0 = (si % O) * s, cs = 40, ix = 20, fx = 380, ox = 600, y0 = 50;
    function inWin(r, q) { return r >= r0 && r < r0 + 3 && q >= c0 && q < c0 + 3; }
    function J(o) { var x = { pad: padS, s: sS, sel: 0 }; for (var kk in o) x[kk] = o[kk]; return JSON.stringify(x); }
    var h = T(ix, 30, (f ? "Image 5×5" : "5×5 image") + (pad ? (f ? " + padding P = 1 (zéros)" : " + padding P = 1 (zeros)") : ""), "sv-2", LAB);
    for (var r = 0; r < N; r++) for (var q = 0; q < N; q++) {
      var iw = inWin(r, q);
      h += '<rect x="' + (ix + q * cs) + '" y="' + (y0 + r * cs) + '" width="' + (cs - 2) + '" height="' + (cs - 2) + '" rx="4" fill="' + (iw ? C(0) : "transparent") + '"' + (iw ? AA : "") + ' stroke="' + (iw ? C(0) : "var(--border2)") + '"' + (isPad(r, q) ? ' stroke-dasharray="4 3"' : "") + "/>";
      h += T(ix + q * cs + cs / 2 - 1, y0 + r * cs + cs / 2 + 5, String(at(r, q)), isPad(r, q) ? "sv-m" : "sv-t", ' font-size="16" text-anchor="middle"');
    }
    h += T(fx, 30, f ? "Filtre 3×3" : "3×3 filter", "sv-2", LAB);
    KER.forEach(function (row, r) { row.forEach(function (v, q) { h += '<rect x="' + (fx + q * cs) + '" y="' + (y0 + r * cs) + '" width="' + (cs - 2) + '" height="' + (cs - 2) + '" rx="4" fill="' + (v ? C(1) : "transparent") + '"' + (v ? AA : "") + ' stroke="' + C(1) + '"/>' + T(fx + q * cs + cs / 2 - 1, y0 + r * cs + cs / 2 + 5, String(v), "sv-t", ' font-size="16" text-anchor="middle"'); }); });
    h += T(fx, y0 + 3 * cs + 30, "stride S = " + s + ", P = " + pad, "sv-2", LAB);
    h += T(ox, 30, "Feature map " + O + "×" + O + (f ? " (cliquez une case)" : " (click a cell)"), "sv-2", LAB);
    for (var i = 0; i < O; i++) for (var j = 0; j < O; j++) {
      var kk = i * O + j, on = kk === si;
      h += '<g data-act="wobj" data-arg="' + esc(k + "|" + J({ sel: kk })) + '" style="cursor:pointer"><rect x="' + (ox + j * cs) + '" y="' + (y0 + i * cs) + '" width="' + (cs - 2) + '" height="' + (cs - 2) + '" rx="4" fill="' + C(0) + '"' + (on ? "" : AA) + ' stroke="' + C(0) + '"/>' +
        '<text x="' + (ox + j * cs + cs / 2 - 1) + '" y="' + (y0 + i * cs + cs / 2 + 5) + '" font-size="16" font-weight="600" text-anchor="middle" font-family="var(--font)" fill="' + (on ? "#fff" : "var(--text)") + '">' + ov(i, j) + "</text></g>";
    }
    h += T(ix, y0 + N * cs + 30, (f ? "Case choisie : somme des pixels sous les 1 du filtre (coins + centre) = " : "Chosen cell: sum of the pixels under the filter's 1s (corners + centre) = ") + [at(r0, c0), at(r0, c0 + 2), at(r0 + 1, c0 + 1), at(r0 + 2, c0), at(r0 + 2, c0 + 2)].join(" + ") + " = " + ov(Math.floor(si / O), si % O), "sv-t", LAB);
    var out = '<div class="ctl">' + segRow(k, [["valid", "valid (P = 0)", J({ pad: "valid" })], ["same", "same (P = 1)", J({ pad: "same" })]], padS, "wobj") +
      segRow(k, [["1", "stride 1", J({ s: "1" })], ["2", "stride 2", J({ s: "2" })]], sS, "wobj") + "</div>";
    out += svg("0 0 1000 380", "Convolution", h);
    out += Study.block(EQ(["Ho = ", { frac: ["H − Hf + 2P", "S"] }, " + 1 = ", { frac: ["5 − 3 + 2·" + pad, String(s)] }, " + 1 = " + (Math.floor((5 - 3 + 2 * pad) / s) + 1)]), k + ".eq");
    return out;
  };

  Study.widgets.pool = function (b, ctx) {
    var mode = ctx.get("max") === "avg" ? "avg" : "max", f = fr();
    var cols = [C(0), C(1), C(2), C(3)], cs = 56;
    function win(r, q) { return Math.floor(r / 2) * 2 + Math.floor(q / 2); }
    function outV(i, j) { var v = [POOL[2 * i][2 * j], POOL[2 * i][2 * j + 1], POOL[2 * i + 1][2 * j], POOL[2 * i + 1][2 * j + 1]]; return mode === "max" ? Math.max.apply(null, v) : v.reduce(function (x, y) { return x + y; }, 0) / 4; }
    var h = T(20, 30, f ? "Entrée 4×4 (slide du cours), fenêtre 2×2, pas 2" : "4×4 input (course slide), 2×2 window, stride 2", "sv-2", LAB);
    POOL.forEach(function (row, r) { row.forEach(function (v, q) {
      var big = mode === "max" && v === outV(Math.floor(r / 2), Math.floor(q / 2)), c = cols[win(r, q)];
      h += '<rect x="' + (20 + q * cs) + '" y="' + (50 + r * cs) + '" width="' + (cs - 3) + '" height="' + (cs - 3) + '" rx="5" fill="' + c + '"' + AA + ' stroke="' + (big ? "var(--text)" : c) + '" stroke-width="' + (big ? 2.5 : 1) + '"/>' + T(20 + q * cs + cs / 2, 50 + r * cs + cs / 2 + 4, String(v), "sv-t", ' font-size="16" text-anchor="middle"' + (big ? ' font-weight="700"' : ""));
    }); });
    h += T(300, 50 + 2 * cs + 4, mode === "max" ? "max →" : (f ? "moyenne →" : "average →"), "sv-2", LAB);
    h += T(420, 30, f ? "Sortie 2×2 (0 paramètre)" : "2×2 output (0 parameters)", "sv-2", LAB);
    [0, 1].forEach(function (i) { [0, 1].forEach(function (j) { var c = cols[i * 2 + j]; h += '<rect x="' + (420 + j * 80) + '" y="' + (78 + i * 80) + '" width="76" height="76" rx="6" fill="' + c + '"' + AA + ' stroke="' + c + '" stroke-width="2"/>' + T(420 + j * 80 + 38, 78 + i * 80 + 44, fmt(outV(i, j)), "sv-t", ' font-size="17" font-weight="700" text-anchor="middle"'); }); });
    h += T(640, 110, f ? "H et L divisés par 2" : "H and L halved", "sv-2", LAB) + T(640, 134, f ? "profondeur inchangée" : "depth unchanged", "sv-2", LAB) + T(640, 158, f ? "13×13 → 6×6 (arrondi inférieur)" : "13×13 → 6×6 (floor)", "sv-2", LAB);
    var txt = mode === "max" ? ["Max pooling (the slide's result): [[56, 48], [255, 32]].", "Max pooling (résultat de la slide) : [[56, 48], [255, 32]]."] : ["Average pooling (tutor computation): [[22.5, 17], [76, 9.5]].", "Pooling moyen (calcul du tuteur) : [[22.5, 17], [76, 9.5]]."];
    return segRow(ctx.key, [["max", "Max pooling"], ["avg", L(["Average pooling", "Pooling moyen"])]], mode) + svg("0 0 1000 300", "Pooling", h) + '<p class="txt">' + esc(L(txt)) + "</p>";
  };

  Study.widgets.arch = function (b, ctx) {
    var a = ctx.get("tp2"); if (!ARCH[a]) a = "tp2";
    var A = ARCH[a], tot = A.layers.reduce(function (x, l) { return x + l.p; }, 0);
    var h = segRow(ctx.key, [["tp1", "TP1 MLP"], ["tp2", "TP2 CNN"], ["s95", L(["Slide 95", "Slide 95"])]], a);
    h += '<p class="txt"><strong>' + esc(L(A.name)) + "</strong></p>";
    h += Study.block(DG(A.layers.length > 6 ? "vertical" : "horizontal", A.layers.map(function (l, i) { return { id: "n" + i, label: l.n, detail: l.out + " · " + nf(l.p) + " p", kind: i === 0 || i === A.layers.length - 1 ? "terminal" : "box" }; }), A.layers.slice(1).map(function (_, i) { return { from: "n" + i, to: "n" + (i + 1) }; })), ctx.key + ".d");
    h += Study.block(tbl([["Layer", "Couche"], ["Output", "Sortie"], ["Parameters", "Paramètres"], ["Formula", "Formule"]], A.layers.map(function (l) { return [l.n, l.out, nf(l.p), l.f]; }).concat([[{ t: "Total", tone: "success" }, "", { t: nf(tot), tone: "success" }, ""]]), { align: ["start", "end", "end", "start"], compact: true }), ctx.key + ".t");
    h += '<p class="txt">' + rich(L(A.note)) + "</p>";
    return h;
  };

  /* ---------- lessons (ported from the canvas) ---------- */
  var DIAG_PASS = [{ id: "x", label: "X (3×1)", kind: "terminal" }, { id: "h", label: ["Hidden: 4 ReLU", "Cachée : 4 ReLU"], detail: "W 4×3, B 4×1" }, { id: "o", label: ["Output: 1 sigmoid", "Sortie : 1 sigmoïde"], detail: ["ψ 1×4, bias C", "ψ 1×4, biais C"] }, { id: "e", label: "E = BCE", kind: "terminal" }];
  var body = {
    intro: {
      b: [
        sec(["AI ⊃ ML ⊃ DL", "IA ⊃ ML ⊃ DL"], [{ t: "svg", x: nestSvg }]),
        sec(["The ECD process in 3 steps", "Le processus ECD en 3 étapes"], [DG("horizontal", [{ id: "d", label: ["Data", "Données"], kind: "terminal" }, { id: "f", label: ["Feature space", "Espace de descripteurs"] }, { id: "m", label: ["Models", "Modèles"] }, { id: "r", label: ["Chosen model", "Modèle retenu"], kind: "terminal" }], [{ from: "d", to: "f", label: ["1. Data preparation", "1. Préparation des données"] }, { from: "f", to: "m", label: ["2. Machine learning", "2. Apprentissage automatique"] }, { from: "m", to: "r", label: "3. Validation" }])]),
        sec(["Types of learning", "Types d'apprentissage"], [DG("vertical", [{ id: "l", label: ["Learning", "Apprentissage"], kind: "terminal" }, { id: "s", label: ["Supervised", "Supervisé"], detail: ["Labelled data", "Données étiquetées"] }, { id: "u", label: ["Unsupervised", "Non supervisé"], detail: ["No labels", "Sans étiquettes"] }, { id: "ss", label: ["Semi-supervised", "Semi-supervisé"], detail: ["Few labels + many unlabelled", "Peu d'étiquettes + beaucoup sans"] }, { id: "r", label: ["Reinforcement", "Par renforcement"], detail: ["State → Action → Reward", "État → Action → Récompense"] }, { id: "c", label: "Classification", detail: ["Class: chat / chien", "Classe : chat / chien"] }, { id: "g", label: ["Regression", "Régression"], detail: ["Continuous value", "Valeur continue"] }, { id: "k", label: "Clustering" }, { id: "dr", label: ["Dimensionality reduction", "Réduction de dimensionnalité"] }, { id: "an", label: ["Anomaly detection", "Détection d'anomalies"] }], [{ from: "l", to: "s" }, { from: "l", to: "u" }, { from: "l", to: "ss" }, { from: "l", to: "r" }, { from: "s", to: "c" }, { from: "s", to: "g" }, { from: "u", to: "k" }, { from: "u", to: "dr" }, { from: "u", to: "an" }])]),
        sec(["ML vs DL (key slide)", "ML vs DL (slide clé)"], [tbl(["", "ML", "DL"], [["Pipeline", ["Manual feature extraction, then classification", "Extraction manuelle, puis classification"], ["Extraction + classification together (end-to-end)", "Extraction + classification ensemble (bout en bout)"]], [["Hardware", "Matériel"], "CPU", "GPU"], [["Data", "Données"], ["Thousands of observations", "Milliers d'observations"], "Big Data"], [["Features", "Descripteurs"], ["Handcrafted, low level", "Faits à la main, bas niveau"], ["Learned, high level", "Appris, haut niveau"]], ["Applications", ["Mostly tabular data", "Surtout des données tabulaires"], ["Vision, NLP, audio", "Vision, NLP, audio"]]])])
      ],
      points: [["AI ⊃ ML ⊃ DL; DL = deep neural networks with many hidden layers.", "IA ⊃ ML ⊃ DL ; DL = réseaux profonds à nombreuses couches cachées."], ["ECD: preparation → feature space, learning → models, validation → chosen model.", "ECD : préparation → espace de descripteurs, apprentissage → modèles, validation → modèle retenu."], ["Generative AI: VAE, GAN, Transformers (LLM, BERT, GPT, ViT).", "IA générative : VAE, GAN, Transformers (LLM, BERT, GPT, ViT)."], ["Frameworks: TensorFlow 2.x (Keras integrated), PyTorch, Caffe, MXNet.", "Frameworks : TensorFlow 2.x (Keras intégré), PyTorch, Caffe, MXNet."]],
      traps: [["TensorFlow was not invented by Facebook (Google); PyTorch is Facebook's.", "TensorFlow n'a pas été inventé par Facebook (Google) ; PyTorch est celui de Facebook."], ["scikit-learn is not a DL framework.", "scikit-learn n'est pas un framework de DL."], ["DL needs a GPU and Big Data; ML relies on manual features.", "Le DL demande un GPU et du Big Data ; le ML repose sur des descripteurs manuels."]]
    },
    perc: {
      b: [
        sec(["Perceptron on the logical OR, step by step (slide 38)", "Perceptron sur le OU logique, pas à pas (slide 38)"], [W("perc")], ["η = 1, start w1 = 1, w2 = −1, b = 0. Weights on the arrows are the values before this step", "η = 1, départ w1 = 1, w2 = −1, b = 0. Les poids sur les flèches sont ceux avant ce pas"]),
        sec(["Why one perceptron fails on XOR", "Pourquoi un perceptron échoue sur XOR"], [{ t: "svg", x: sepSvg }]),
        sec(["Delta rule (Widrow-Hoff)", "Règle delta (Widrow-Hoff)"], [EQ(["wᵢ ← wᵢ + η · (d − sortie) · xᵢ"]), EQ(["b ← b + η · (d − sortie)"]), tbl([["Biological", "Biologique"], ["Artificial", "Artificiel"]], [["Dendrites", ["Inputs xᵢ", "Entrées xᵢ"]], ["Synapses", ["Weights wᵢ", "Poids wᵢ"]], [["Cell body", "Corps cellulaire"], ["Weighted sum Y = Σ wᵢxᵢ + b", "Somme pondérée Y = Σ wᵢxᵢ + b"]], [["Axon", "Axone"], ["Activation f, output f(Y)", "Activation f, sortie f(Y)"]]])])
      ],
      points: [["History: 1957 perceptron, 1969 XOR, 1986 MLP + backprop, 2006 deep networks.", "Historique : 1957 perceptron, 1969 XOR, 1986 PMC + rétropropagation, 2006 réseaux profonds."], ["Heaviside: 1 if Y ≥ 0 (Y = 0 gives 1).", "Heaviside : 1 si Y ≥ 0 (Y = 0 donne 1)."], ["output = d → no change; output < d → weights up; output > d → down. Bias input x₀ = 1.", "sortie = d → rien ; sortie < d → poids en hausse ; sortie > d → en baisse. Entrée du biais x₀ = 1."], ["Stopping: stable weights for one epoch, error stops falling, error threshold, max iterations, fixed epochs.", "Arrêt : poids stables une époque, l'erreur ne baisse plus, seuil d'erreur, itérations max, nombre d'époques."], ["Slide 40 activity: Q1 output 1, Q2 unchanged, Q3 converged at iteration 10 (tutor). The numbers give 60% accuracy although stable weights imply 100%: the slide is inconsistent.", "Activité slide 40 : Q1 sortie 1, Q2 inchangés, Q3 convergence à l'itération 10 (tuteur). Les chiffres donnent 60 % alors que des poids stables impliquent 100 % : la slide est incohérente."]],
      traps: [["Parameters = features + 1; observations do not count.", "Paramètres = descripteurs + 1 ; les observations ne comptent pas."], ["XOR is not linearly separable; AND and OR are.", "XOR n'est pas linéairement séparable ; AND et OR le sont."], ["Forgetting the bias in Y (Z(4,6,7,1): Y = 18, not 17).", "Oublier le biais dans Y (Z(4,6,7,1) : Y = 18, pas 17)."]]
    },
    mlp: {
      b: [
        sec(["Activation functions: switch the curve", "Fonctions d'activation : changez la courbe"], [W("act")], ["Leaky ReLU drawn with α = 0.1, ELU with α = 1", "Leaky ReLU tracée avec α = 0.1, ELU avec α = 1"]),
        sec(["Softmax (multi-class output)", "Softmax (sortie multi-classe)"], [EQ(["f(Zᵢ) = ", { frac: ["e^Zᵢ", "Σₐ e^Zₐ"] }]), P(["Each output is in [0, 1] and they sum to 1. Derivative: f(Zᵢ)(1 − f(Zᵢ)) if i = j, −f(Zᵢ)f(Zⱼ) if i ≠ j.", "Chaque sortie est dans [0, 1] et leur somme vaut 1. Dérivée : f(Zᵢ)(1 − f(Zᵢ)) si i = j, −f(Zᵢ)f(Zⱼ) si i ≠ j."])]),
        sec(["MLP layers (TP1 shape)", "Couches du PMC (forme du TP1)"], [DG("horizontal", [{ id: "i", label: ["Input: 784", "Entrée : 784"], detail: ["p = number of features", "p = nombre de descripteurs"], kind: "terminal" }, { id: "h1", label: ["Hidden 128 ReLU", "Cachée 128 ReLU"] }, { id: "h2", label: ["Hidden 128 ReLU", "Cachée 128 ReLU"] }, { id: "h3", label: ["Hidden 64 ReLU", "Cachée 64 ReLU"] }, { id: "o", label: ["Output: 10 softmax", "Sortie : 10 softmax"], detail: ["n = number of classes", "n = nombre de classes"], kind: "terminal" }], [{ from: "i", to: "h1" }, { from: "h1", to: "h2" }, { from: "h2", to: "h3" }, { from: "h3", to: "o" }])])
      ],
      points: [["Fully connected and sequential.", "Entièrement connecté et séquentiel."], ["Input layer = number of features p; output layer = number of classes n (binary: 1 sigmoid neuron).", "Couche d'entrée = nombre de descripteurs p ; sortie = nombre de classes n (binaire : 1 neurone sigmoïde)."], ["'Deep' = number of hidden layers; more layers and neurons raise the separating power.", "« Profond » = nombre de couches cachées ; plus de couches et de neurones augmentent le pouvoir séparateur."], ["Sigmoid' range ]0, 0.25]; ELU' range ]0, 1] (the slide's ]−∞, 1] is a typo).", "Intervalle de sigmoïde' ]0, 0.25] ; d'ELU' ]0, 1] (le ]−∞, 1] de la slide est une coquille)."]],
      traps: [["Softmax sums to 1; sigmoid does not.", "Softmax somme à 1 ; la sigmoïde non."], ["Softplus' = sigmoid, not ReLU.", "Softplus' = sigmoïde, pas ReLU."], ["ReLU range is [0, +∞[, not ]0, 1[.", "L'intervalle de ReLU est [0, +∞[, pas ]0, 1[."]]
    },
    gd: {
      b: [
        sec(["Gradient descent: switch the learning rate", "Descente de gradient : changez le taux d'apprentissage"], [W("gd"), EQ(["w ← w − η · ", { frac: ["∂E", "∂w"] }])], ["Illustrative curve showing the course's three η behaviours", "Courbe illustrative des trois comportements de η du cours"]),
        sec(["Forward and backward pass (slides 57–60 activity)", "Passes avant et arrière (activité slides 57–60)"], [SEG([["fwd", ["Forward pass", "Propagation avant"]], ["bwd", ["Backward pass", "Rétropropagation"]]], {
          fwd: [DG("horizontal", DIAG_PASS, [{ from: "x", to: "h", label: "Y = W·X + B, f1 = ReLU(Y)" }, { from: "h", to: "o", label: "Z = ψ·f1 + C, f2 = sigmoid(Z)" }, { from: "o", to: "e", label: "−[y ln f2 + (1 − y) ln(1 − f2)]" }]), P(["Matrix form: output = f(W·X + B), W has shape (#out, #in). Slide example: W·X = (−1.3, 0.8, −0.4) before adding B.", "Forme matricielle : sortie = f(W·X + B), W de forme (#sorties, #entrées). Exemple du cours : W·X = (−1.3, 0.8, −0.4) avant d'ajouter B."])],
          bwd: [DG("horizontal", DIAG_PASS, [{ from: "e", to: "o", label: "∂E/∂f2 · f2(1 − f2) = f2 − y", dashed: true }, { from: "o", to: "h", label: "∂E/∂ψⱼ = (f2 − y)·f1(Yⱼ)", dashed: true }, { from: "h", to: "x", label: "∂E/∂Wⱼᵢ = (f2 − y)·ψⱼ·ReLU′(Yⱼ)·xᵢ", dashed: true }]), P(["Chain rule from the loss back to each weight; the simplified forms are the tutor's.", "Règle de dérivation en chaîne de la perte vers chaque poids ; les formes simplifiées sont du tuteur."])]
        }, "fwd")]),
        sec(["Which loss?", "Quelle perte ?"], [tbl([["Problem", "Problème"], ["Output", "Sortie"], ["Loss", "Perte"]], [[["Binary", "Binaire"], ["1 sigmoid", "1 sigmoïde"], "binary_crossentropy: −[d ln f(Z) + (1 − d) ln(1 − f(Z))]"], [["Multi-class, integer labels", "Multi-classe, étiquettes entières"], "softmax", "sparse_categorical_crossentropy (TP1)"], [["Multi-class, one-hot labels", "Multi-classe, étiquettes one-hot"], "softmax", "categorical_crossentropy: −Σ d_l ln f(Z_l)"], [["Regression", "Régression"], ["linear", "linéaire"], "MSE: (1/M) Σ (d − f(Z))²"]])])
      ],
      points: [["∂E/∂w > 0 → w decreases; ∂E/∂w < 0 → w increases.", "∂E/∂w > 0 → w diminue ; ∂E/∂w < 0 → w augmente."], ["η too small → slow; too large → oscillates and diverges; risk of a local minimum.", "η trop petit → lent ; trop grand → oscille et diverge ; risque de minimum local."], ["W shape = (#neurons out, #neurons in).", "Forme de W = (#neurones sortie, #neurones entrée)."], ["Backprop = chain rule; ReLU′ is 0 or 1, sigmoid′ = f(1 − f).", "Rétropropagation = dérivation en chaîne ; ReLU′ vaut 0 ou 1, sigmoïde′ = f(1 − f)."]],
      traps: [["Integer labels → sparse_categorical_crossentropy, not categorical.", "Étiquettes entières → sparse_categorical_crossentropy, pas categorical."], ["BCE goes with 1 sigmoid neuron, not softmax.", "BCE va avec 1 neurone sigmoïde, pas softmax."], ["The minus sign: w moves against the gradient.", "Le signe moins : w va contre le gradient."]]
    },
    batch: {
      b: [
        sec(["Epoch, batch, iteration calculator", "Calculateur époque, batch, itération"], [W("batch")]),
        sec(["Gradient descent variants", "Variantes de descente de gradient"], [tbl([["Variant", "Variante"], ["Gradient on", "Gradient sur"], "+", "−"], [["BGD", ["All N observations", "Les N observations"], "stable", { t: ["Slow; stuck in local minima", "Lent ; bloqué dans des minima locaux"], tone: "warning" }], ["SGD", ["1 observation", "1 observation"], ["Fast updates", "Mises à jour rapides"], { t: ["Unstable", "Instable"], tone: "warning" }], ["MBGD", ["M observations", "M observations"], ["Converges faster than BGD", "Converge plus vite que BGD"], ["Sensitive to batch_size", "Sensible à batch_size"]]])]),
        sec(["Optimizer family", "Famille des optimiseurs"], [DG("horizontal", [{ id: "gd", label: ["Gradient descent", "Descente de gradient"], kind: "terminal" }, { id: "mo", label: "Momentum", detail: ["Memory of past gradients", "Mémoire des gradients passés"] }, { id: "ag", label: "AdaGrad", detail: ["η per parameter, accumulates g²", "η par paramètre, cumule g²"] }, { id: "rp", label: "RMSProp", detail: ["Moving average instead", "Moyenne mobile à la place"] }, { id: "ad", label: "AdaDelta", detail: ["No global η", "Pas de η global"] }, { id: "am", label: "Adam", detail: ["Momentum + RMSProp; β1, β2", "Momentum + RMSProp ; β1, β2"], kind: "terminal" }], [{ from: "gd", to: "mo" }, { from: "gd", to: "ag" }, { from: "ag", to: "rp" }, { from: "ag", to: "ad" }, { from: "mo", to: "am" }, { from: "rp", to: "am" }])]),
        sec(["Parameters vs hyperparameters", "Paramètres vs hyperparamètres"], [tbl([["Parameters (learned)", "Paramètres (appris)"], ["Hyperparameters (chosen by you)", "Hyperparamètres (choisis)"]], [[["Weights", "Poids"], ["Learning rate η, epochs, batch_size", "Taux η, époques, batch_size"]], [["Biases", "Biais"], ["Neurons per layer, hidden layers, optimizer, activations", "Neurones par couche, couches cachées, optimiseur, activations"]]])])
      ],
      points: [["Epoch = one pass over the training set; iteration = one weight update = one batch.", "Époque = un passage sur l'entraînement ; itération = une mise à jour = un batch."], ["Iterations per epoch = ⌈N / batch_size⌉ (Keras prints 1688/1688 in TP1).", "Itérations par époque = ⌈N / batch_size⌉ (Keras affiche 1688/1688 au TP1)."], ["Landscape problems: non-convexity, local minima, saddle points, plateaux, weak gradients.", "Problèmes du paysage : non-convexité, minima locaux, points selles, plateaux, gradients faibles."], ["Adam is used in both TPs.", "Adam est utilisé dans les deux TP."]],
      traps: [["batch_size = 1 → N iterations (SGD); batch_size = N → 1 iteration (BGD).", "batch_size = 1 → N itérations (SGD) ; batch_size = N → 1 itération (BGD)."], ["'BGD is fast and reliable' is false.", "« BGD est rapide et fiable » est faux."], ["Round up: 54000 / 32 = 1687.5 → 1688.", "Arrondir au-dessus : 54000 / 32 = 1687.5 → 1688."], ["Weights and biases are parameters, not hyperparameters.", "Poids et biais sont des paramètres, pas des hyperparamètres."]]
    },
    eval: {
      b: [
        sec(["TP1 confusion matrix (test set, 10,000 images)", "Matrice de confusion du TP1 (test, 10 000 images)"], [W("cm"), P(["These match the official classification report. Diagonal sum 8,856 / 10,000; evaluate() printed accuracy 0.8870.", "Ces valeurs correspondent au rapport de classification officiel. Somme de la diagonale 8 856 / 10 000 ; evaluate() a affiché 0.8870."])], ["Rows = desired class, columns = predicted class", "Lignes = classe désirée, colonnes = classe prédite"]),
        sec(["Overfitting vs underfitting: read the curves", "Sur- vs sous-apprentissage : lire les courbes"], [W("fit")], ["Schematic shapes of the course definitions, not TP1 data", "Formes schématiques des définitions du cours, pas des données du TP1"]),
        sec(["TP1 training log: first and last epoch", "Journal d'entraînement TP1 : première et dernière époque"], [tbl([["Epoch", "Époque"], "accuracy", "loss", "val_accuracy", "val_loss"], [["1", "0.7593", "0.6648", "0.8580", "0.3942"], ["10", "0.9094", "0.2365", "0.8775", "0.3502"], [["Test (evaluate)", "Test (evaluate)"], "0.8870", "0.3301", "", ""]], { align: ["start", "end", "end", "end", "end"] }), P(["Training accuracy (0.91) ends above validation (0.88) and val_loss stalls around 0.32–0.35 while loss keeps falling: the start of overfitting (tutor reading).", "L'exactitude d'entraînement (0.91) finit au-dessus de la validation (0.88) et val_loss stagne vers 0.32–0.35 pendant que loss baisse : début de sur-apprentissage (lecture du tuteur)."])]),
        sec(["Keras model lifecycle", "Cycle de vie d'un modèle Keras"], [STEPS([[["Define", "Définir"], "`Sequential([...])`"], [["Compile", "Compiler"], "`model.compile(optimizer, loss, metrics)`"], [["Fit", "Entraîner"], ["`model.fit(x, y, epochs, batch_size, validation_data)` returns `history`", "`model.fit(x, y, epochs, batch_size, validation_data)` renvoie `history`"]], [["Evaluate", "Évaluer"], ["`model.evaluate(x_test, y_test)` returns [loss, acc]", "`model.evaluate(x_test, y_test)` renvoie [loss, acc]"]], [["Predict", "Prédire"], ["`model.predict(x)` gives probabilities; `np.argmax(..., axis=1)` gives the class", "`model.predict(x)` donne des probabilités ; `np.argmax(..., axis=1)` donne la classe"]]])])
      ],
      points: [["Accuracy = Σ diagonal / n.", "Exactitude = Σ diagonale / n."], ["Recall = diagonal / row; precision = diagonal / column; F1 = 2PR / (P + R).", "Rappel = diagonale / ligne ; précision = diagonale / colonne ; F1 = 2PR / (P + R)."], ["Sensitivity = TP / (TP + FN); specificity = TN / (FP + TN).", "Sensibilité = TP / (TP + FN) ; spécificité = TN / (FP + TN)."], ["Validation set is carved from train and tunes hyperparameters.", "La validation est prise dans le train et sert à régler les hyperparamètres."], ["TP1 worst class: Shirt (P 0.74, R 0.68, F1 0.71), mostly confused with T-shirt (144).", "Pire classe du TP1 : Shirt (P 0.74, R 0.68, F1 0.71), surtout confondue avec T-shirt (144)."]],
      traps: [["Recall and precision swapped: row vs column.", "Rappel et précision inversés : ligne vs colonne."], ["Overfitting = train error down, val error up; underfitting = both high.", "Sur-apprentissage = erreur train en baisse, val en hausse ; sous-apprentissage = les deux élevées."], ["predict() gives probabilities, not classes; evaluate() gives [loss, metric].", "predict() donne des probabilités, pas des classes ; evaluate() donne [loss, metric]."]]
    },
    conv: {
      b: [
        sec(["Convolution sliding window (slide 84)", "Fenêtre glissante de la convolution (slide 84)"], [W("conv")], ["Valid + stride 1 is the slide's case; the other settings are computed by the tutor from the same numbers", "Valid + pas 1 est le cas de la slide ; les autres réglages sont calculés par le tuteur sur les mêmes nombres"]),
        sec(["Pooling by hand (course matrix)", "Pooling à la main (matrice du cours)"], [W("pool")]),
        sec(["What a CNN learns, and its 4 layer types", "Ce qu'apprend un CNN, et ses 4 types de couches"], [DG("horizontal", [{ id: "im", label: "Image", kind: "terminal" }, { id: "cv", label: "Convolution + ReLU", detail: ["Extracts features", "Extrait les descripteurs"] }, { id: "pl", label: "Pooling", detail: ["Keeps the important ones", "Garde les importants"] }, { id: "fl", label: "Flatten", detail: ["Matrices → 1D", "Matrices → 1D"] }, { id: "fc", label: "Fully connected", detail: ["Classification model", "Modèle de classification"] }, { id: "y", label: ["Class", "Classe"], kind: "terminal" }], [{ from: "im", to: "cv" }, { from: "cv", to: "pl", label: ["repeat", "répéter"] }, { from: "pl", to: "fl" }, { from: "fl", to: "fc" }, { from: "fc", to: "y", label: "softmax / sigmoid" }]), P(["Feature hierarchy: pixels → edges → object parts → objects (like letter → word → sentence → article).", "Hiérarchie : pixels → contours → parties d'objet → objets (comme lettre → mot → phrase → article)."])])
      ],
      points: [["Depth = number of filters; kernel_size; stride; padding valid (P = 0) or same (P = (K − 1)/2).", "Profondeur = nombre de filtres ; kernel_size ; pas ; padding valid (P = 0) ou same (P = (K − 1)/2)."], ["Volume: one 3×3×3 filter sums over all 3 channels (+ bias): 463 − 498 + 164 = 129.", "Volume : un filtre 3×3×3 somme sur les 3 canaux (+ biais) : 463 − 498 + 164 = 129."], ["'Divide by the number of pixels' is only for the ±1 matching example.", "« Diviser par le nombre de pixels » ne vaut que pour l'exemple de correspondance ±1."], ["Pooling: smaller maps, less computation and overfitting, fixed length, translation invariance.", "Pooling : cartes plus petites, moins de calcul et de sur-apprentissage, longueur fixe, invariance à la translation."], ["Keras defaults: Conv2D kernel (3,3), strides (1,1), padding 'valid', activation None; MaxPooling2D (2,2), strides = pool_size.", "Défauts Keras : Conv2D noyau (3,3), strides (1,1), padding 'valid', activation None ; MaxPooling2D (2,2), strides = pool_size."]],
      traps: [["'same' keeps the size only with stride 1.", "'same' garde la taille seulement avec un pas de 1."], ["Pooling has 0 parameters and keeps the depth.", "Le pooling a 0 paramètre et garde la profondeur."], ["Floor in the formula: 13 → 6 with a 2×2/2 pool.", "Arrondi inférieur : 13 → 6 avec un pool 2×2/2."]]
    },
    arch: {
      b: [
        sec(["Layer by layer: shapes and parameters", "Couche par couche : formes et paramètres"], [W("arch")]),
        sec(["Formulas to know by heart", "Formules à connaître par cœur"], [EQ(["Ho = ", { frac: ["H − Hf + 2P", "S"] }, ["+ 1,  Wo = number of filters", "+ 1,  Wo = nombre de filtres"]]), EQ([["Conv params = (Hf · Lf · C_in + 1) · n_filters", "Params conv = (Hf · Lf · C_in + 1) · n_filters"]]), EQ([["Dense params = (n_in + 1) · n_out", "Params Dense = (n_in + 1) · n_out"]]), P(["Pooling and Flatten: 0 parameters. Flatten size = H · L · W. Global pooling: one value per channel. Slide example Conv2D(20, 3×3, same) on 64×64×3 → 64×64×20, 560 parameters.", "Pooling et Flatten : 0 paramètre. Taille de Flatten = H · L · W. Pooling global : une valeur par canal. Exemple du cours Conv2D(20, 3×3, same) sur 64×64×3 → 64×64×20, 560 paramètres."])]),
        sec(["AlexNet (slide 96): where the parameters are", "AlexNet (slide 96) : où sont les paramètres"], [tbl([["Part", "Partie"], ["Parameters", "Paramètres"], ["Share", "Part"]], [[["Conv layers (5)", "Couches conv (5)"], "≈ 3.7 M", "6%"], [["Fully connected (9216 → 4096 → 4096 → 1000)", "Entièrement connectées (9216 → 4096 → 4096 → 1000)"], "≈ 58.6 M", { t: "94%", tone: "warning" }], ["Total", "62.37 M", "100%"]], { align: ["start", "end", "end"] }), P(["Input 227×227×3; Conv1 96 filters 11×11, stride 4 → 55×55. 2012 ILSVRC winner: 8 layers, GPUs, dropout.", "Entrée 227×227×3 ; Conv1 96 filtres 11×11, pas 4 → 55×55. Vainqueur ILSVRC 2012 : 8 couches, GPU, dropout."])])
      ],
      points: [["TP1: 784 → 128 → 128 → 64 → 10 = 125,898 parameters; Adam, sparse CE, batch 32, 10 epochs.", "TP1 : 784 → 128 → 128 → 64 → 10 = 125 898 paramètres ; Adam, sparse CE, batch 32, 10 époques."], ["TP2: 28×28×3, binary, BCE, batch 64, 42,634 parameters (tutor), checkpoint on val_accuracy.", "TP2 : 28×28×3, binaire, BCE, batch 64, 42 634 paramètres (tuteur), checkpoint sur val_accuracy."], ["ModelCheckpoint(filepath, monitor, save_best_only=True) in fit(callbacks=[...]).", "ModelCheckpoint(filepath, monitor, save_best_only=True) dans fit(callbacks=[...])."], ["`.keras` = whole model (load_model); `.weights.h5` = weights only (load_weights, rebuild first).", "`.keras` = modèle entier (load_model) ; `.weights.h5` = poids seuls (load_weights, reconstruire d'abord)."]],
      traps: [["Forgetting C_in or the +1 bias in conv parameters.", "Oublier C_in ou le +1 du biais dans les paramètres conv."], ["Output depth = number of filters, not input channels.", "Profondeur de sortie = nombre de filtres, pas les canaux d'entrée."], ["FC input must be a fixed-size 1D vector.", "L'entrée du FC doit être un vecteur 1D de taille fixe."]]
    }
  };

  var CHEAT = [
    { h: ["Neuron & perceptron", "Neurone & perceptron"], items: ["Y = Σ wᵢxᵢ + b; sortie = f(Y).", ["Heaviside: 1 if Y ≥ 0, else 0.", "Heaviside : 1 si Y ≥ 0, sinon 0."], "wᵢ ← wᵢ + η(d − sortie)xᵢ; b ← b + η(d − sortie).", ["Parameters = features + 1.", "Paramètres = descripteurs + 1."], ["XOR not separable → MLP.", "XOR non séparable → PMC."]] },
    { h: ["Activations & losses", "Activations & pertes"], items: [["Sigmoid ]0,1[, f′ = f(1 − f) ≤ 0.25: binary output.", "Sigmoïde ]0,1[, f′ = f(1 − f) ≤ 0.25 : sortie binaire."], ["ReLU [0,+∞[ hidden; softplus′ = sigmoid.", "ReLU [0,+∞[ en caché ; softplus′ = sigmoïde."], ["Leaky ]−∞,+∞[; ELU ]−α,+∞[; softmax sums to 1.", "Leaky ]−∞,+∞[ ; ELU ]−α,+∞[ ; softmax somme à 1."], ["Binary → BCE; integer labels → sparse CE; one-hot → CE; regression → MSE.", "Binaire → BCE ; entiers → sparse CE ; one-hot → CE ; régression → MSE."]] },
    { h: ["Training", "Entraînement"], items: ["w ← w − η·∂E/∂w; η = 0.001.", ["Iterations/epoch = ⌈N / batch_size⌉.", "Itérations/époque = ⌈N / batch_size⌉."], ["BGD stable, slow; SGD fast, unstable; MBGD faster than BGD.", "BGD stable, lent ; SGD rapide, instable ; MBGD plus rapide que BGD."], ["Adam = Momentum + RMSProp; RMSProp = AdaGrad + moving average; AdaDelta = no η.", "Adam = Momentum + RMSProp ; RMSProp = AdaGrad + moyenne mobile ; AdaDelta = sans η."], ["W shape (#out, #in).", "Forme de W (#sorties, #entrées)."]] },
    { h: ["Evaluation", "Évaluation"], items: [["CM rows = desired, columns = predicted.", "MC lignes = désirées, colonnes = prédites."], ["Recall ÷ row, precision ÷ column, F1 = 2PR/(P + R).", "Rappel ÷ ligne, précision ÷ colonne, F1 = 2PR/(P + R)."], ["Sensitivity TP/(TP + FN); specificity TN/(FP + TN).", "Sensibilité TP/(TP + FN) ; spécificité TN/(FP + TN)."], ["Overfit: train ↓, val ↑. Underfit: both high.", "Sur-app. : train ↓, val ↑. Sous-app. : les deux élevées."]] },
    { h: ["CNN formulas", "Formules CNN"], items: ["Ho = (H − Hf + 2P)/S + 1.", ["valid P = 0; same P = (K − 1)/2 (stride 1).", "valid P = 0 ; same P = (K − 1)/2 (pas 1)."], ["Conv params (Hf·Lf·C_in + 1)·n; Dense (n_in + 1)·n_out.", "Params conv (Hf·Lf·C_in + 1)·n ; Dense (n_in + 1)·n_out."], ["Pool/Flatten 0 params; 2×2/2 halves H, L (floor).", "Pool/Flatten 0 param ; 2×2/2 divise H, L par 2 (arrondi inf.)."], ["Global pooling → one value per channel.", "Pooling global → une valeur par canal."]] },
    { h: ["Keras & TPs", "Keras & TP"], items: [["define → compile → fit → evaluate → predict.", "define → compile → fit → evaluate → predict."], ["Conv2D defaults: (3,3), strides 1, 'valid', activation None.", "Défauts Conv2D : (3,3), pas 1, 'valid', activation None."], ["TP1: 125,898 params, 1688 it/epoch, test acc 0.8870.", "TP1 : 125 898 params, 1688 it/époque, test acc 0.8870."], ["TP2: 42,634 params (tutor), BCE, batch 64.", "TP2 : 42 634 params (tuteur), BCE, batch 64."], ["save_best_only=True keeps the best by monitor.", "save_best_only=True garde le meilleur selon monitor."]] }
  ];

  function cnt(s) { return BANK.filter(function (q) { return q.s === s; }).length; }
  Study.register({
    id: "dl",
    codeLang: "python",
    tagline: ["8 visual lessons, " + cnt("Course quiz") + " course-quiz questions, " + cnt("Practice") + " practice + " + cnt("Lesson check") + " lesson checks, 2 mocks of 20.", "8 leçons visuelles, " + cnt("Course quiz") + " questions des quiz du cours, " + cnt("Practice") + " d'entraînement + " + cnt("Lesson check") + " vérifs, 2 examens blancs de 20."],
    summary: ["Visual lessons, the course quizzes, 32 practice questions and two scored mocks for the Deep Learning exam on Tuesday 3 November 2026 at 10:30.", "Leçons visuelles, les quiz du cours, 32 questions d'entraînement et deux examens blancs notés pour l'examen de Deep Learning du mardi 3 novembre 2026 à 10h30."],
    sources: SRC,
    lessonCaption: ["Course order. Visual first, then key points, traps and a mini-quiz", "Ordre du cours. Visuel d'abord, puis points clés, pièges et mini-quiz"],
    bankCaption: ["Single answer: click to see the result. Multi-answer: tick, then Check", "Réponse unique : cliquez pour voir le résultat. Réponses multiples : cochez, puis Vérifier"],
    mockCaption: ["20 questions from the bank. No feedback until you submit; exact match = 1 point. Aim for about 20 minutes", "20 questions de la banque. Pas de correction avant de valider ; réponse exacte = 1 point. Visez environ 20 minutes"],
    lessons: LESSONS.map(function (l) { var x = body[l.id]; return { id: l.id, label: l.label, b: x.b, points: x.points, traps: x.traps }; }),
    bank: BANK,
    mocks: { A: { ids: MOCK.A, minutes: 20, label: ["Set A", "Série A"] }, B: { ids: MOCK.B, minutes: 20, label: ["Set B", "Série B"] } },
    materials: MATERIALS.filter(function (m) { return m.path.indexOf("course/view") < 0; }).map(function (m) { return { title: m.title, kind: m.kind, note: ["Course file (module link not confirmed; opens the course page, where it is listed)", "Fichier du cours (lien du module non confirmé ; ouvre la page du cours, où il figure)"] }; }),
    materialsNote: [CO("info", ["Links", "Liens"], ["Every card opens the Deep Learning course page (course/view.php?id=1284). The university files are not copied here. You need to be logged in to the IIT Moodle.", "Chaque carte ouvre la page du cours Deep Learning (course/view.php?id=1284). Les fichiers de l'université ne sont pas copiés ici. Connexion au Moodle de l'IIT requise."])],
    cheat: CHEAT,
    exam: {
      props: [{ label: "Date", value: ["Tuesday 3 November 2026, 10:30", "Mardi 3 novembre 2026, 10h30"] }, { label: ["Length", "Durée"], value: ["1 hour", "1 heure"] }, { label: "Format", value: ["QCM only: single answer, multiple answers, true/false", "QCM uniquement : réponse unique, multiple, vrai/faux"] }, { label: ["Past papers", "Annales"], value: ["None: no past DS exists for Deep Learning", "Aucune : il n'existe pas d'ancien DS de Deep Learning"] }, { label: ["Covered", "Programme"], value: ["Introduction, Ch1 (deep networks), Ch2 (CNN), TP1, TP2", "Introduction, Ch1 (réseaux profonds), Ch2 (CNN), TP1, TP2"] }],
      b: [
        { t: "list", ordered: true, items: [["Perceptron update by hand (delta rule)", "Mise à jour du perceptron à la main (règle delta)"], ["CNN output size and parameter count", "Taille de sortie et nombre de paramètres CNN"], ["Convolution and max/avg pooling by hand", "Convolution et pooling max/moyen à la main"], ["Activation functions: formula, range, derivative, use", "Fonctions d'activation : formule, intervalle, dérivée, usage"], ["Which loss for which problem", "Quelle perte pour quel problème"], ["Epochs, batch_size, iterations; BGD vs SGD vs MBGD", "Époques, batch_size, itérations ; BGD vs SGD vs MBGD"], ["Metrics from a confusion matrix", "Métriques depuis une matrice de confusion"], ["Overfitting, parameters vs hyperparameters, optimizers, Keras", "Sur-apprentissage, paramètres vs hyperparamètres, optimiseurs, Keras"]] },
        P(["Most likely question types, ranked. The course quizzes show the style: single answer, multiple answers, true/false and short calculations.", "Types de questions les plus probables, classés. Les quiz du cours montrent le style : réponse unique, multiple, vrai/faux et petits calculs."]),
        CO("warning", ["No past DS to train on", "Pas d'ancien DS pour s'entraîner"], ["The questions here are the course's own quizzes plus practice questions built only from the slides and TPs. Values marked 'tutor' were computed by the tutor, not given in an official correction.", "Les questions ici sont les quiz du cours et des questions d'entraînement construites uniquement à partir des slides et des TP. Les valeurs marquées « tuteur » ont été calculées par le tuteur, pas données par une correction officielle."])
      ]
    }
  });
})();
