#!/usr/bin/env python3
"""Copy course files from the box into files/<subject>/ and write assets/files.js (manifest).
Not part of the site at runtime; re-run when new course files are downloaded."""
import json, os, shutil, zipfile, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
D = "/workspace/dmml/"; C = "/workspace/courses/"
# (src, dest_name, group, [title_en, title_fr], zip?)
F = {
 "dmml": [
  (D+"Cours_DM_ML(Intro+chapitres 1 et 2).pdf", "cours-intro-ch1-ch2.pdf", "course", ["Course: Intro + Chapters 1 & 2 (KDD, data types, preprocessing, EDA)", "Cours : Intro + chapitres 1 et 2 (ECD, types de données, prétraitement, EDA)"]),
  (D+"Cours_DM_ML(chapitre3_RegAss).pdf", "cours-ch3-regles-association.pdf", "course", ["Course: Chapter 3, Association rules", "Cours : chapitre 3, Règles d'association"]),
  (D+"Rappel_pratique(np_pd_plt_sns).pdf", "rappel-pratique-numpy-pandas-matplotlib-seaborn.pdf", "course", ["Practical refresher: NumPy, pandas, Matplotlib, Seaborn", "Rappel pratique : NumPy, pandas, Matplotlib, Seaborn"]),
  (D+"TP1/TP1.pdf", "tp1.pdf", "tdtp", ["TP1: lab sheet", "TP1 : énoncé"]),
  (D+"TP1/TP1.ipynb", "tp1.ipynb", "tdtp", ["TP1: notebook", "TP1 : notebook"]),
  (D+"TP1/athlete.csv", "tp1-athlete.csv", "tdtp", ["TP1: dataset athlete.csv", "TP1 : jeu de données athlete.csv"]),
  (D+"TP2/TP2.pdf", "tp2.pdf", "tdtp", ["TP2: lab sheet", "TP2 : énoncé"]),
  (D+"TP2/TP2_DM.ipynb", "tp2.ipynb", "tdtp", ["TP2: notebook", "TP2 : notebook"]),
  (D+"TP2/titanic.csv", "tp2-titanic.csv", "tdtp", ["TP2: dataset titanic.csv", "TP2 : jeu de données titanic.csv"]),
  (D+"Corr_TP1.pdf", "correction-tp1.pdf", "corr", ["TP1 solution (Correction TP1)", "Correction TP1"]),
  (D+"Corr_TP2.pdf", "correction-tp2.pdf", "corr", ["TP2 solution (Correction TP2)", "Correction TP2"]),
  (C+"exams/dmml/DS_2024_Fouille_de_donnees.pdf", "ds-2024-fouille-de-donnees.pdf", "exams", ["DS 2024: Data mining (Fouille de données)", "DS 2024 : Fouille de données"]),
  (D+"data_exemple_cours.xlsx", "data-exemple-cours.xlsx", "other", ["Course example data (data exemple cours)", "Données d'exemple du cours"]),
  (D+"Enoncé_projet_DM_ML.pdf", "enonce-projet-dm-ml.pdf", "other", ["Project brief (Énoncé du projet)", "Énoncé du projet DM & ML"]),
  (D+"Template_Projet_DM_ML.ipynb", "template-projet-dm-ml.ipynb", "other", ["Project notebook template", "Template du projet (notebook)"]),
 ],
 "dl": [
  (C+"dl/Cours-DL_Intro.pdf", "cours-dl-intro.pdf", "course", ["Course: Introduction to Deep Learning", "Cours : Introduction au Deep Learning"]),
  (C+"dl/Cours-DL_Chap1_V3.pdf", "cours-dl-chap1.pdf", "course", ["Course: Chapter 1 (neurons, perceptron, MLP)", "Cours : chapitre 1 (neurone, perceptron, MLP)"]),
  (C+"dl/Cours-DL_Chap2.pdf", "cours-dl-chap2.pdf", "course", ["Course: Chapter 2 (CNN)", "Cours : chapitre 2 (CNN)"]),
  (C+"dl/TP1/TP1.pdf", "tp1.pdf", "tdtp", ["TP1: lab sheet", "TP1 : énoncé"]),
  (C+"dl/TP1/TP1_DL.ipynb", "tp1-dl.ipynb", "tdtp", ["TP1: notebook", "TP1 : notebook"]),
  (C+"dl/TP2/TP2.pdf", "tp2.pdf", "tdtp", ["TP2: lab sheet", "TP2 : énoncé"]),
  (C+"dl/TP2/TP2_DL.ipynb", "tp2-dl.ipynb", "tdtp", ["TP2: notebook", "TP2 : notebook"]),
  (C+"dl/TP1_DL_Correction.pdf", "correction-tp1-dl.pdf", "corr", ["TP1 solution (Correction TP1)", "Correction TP1"]),
 ],
 "dw": [
  (C+"dw/Chapitre 1 DataWarehouse.pdf", "chapitre-1-datawarehouse.pdf", "course", ["Chapter 1: Data warehouse", "Chapitre 1 : Entrepôt de données"]),
  (C+"dw/Chapitre 2 DataWarehouse.pdf", "chapitre-2-datawarehouse.pdf", "course", ["Chapter 2: Data warehouse", "Chapitre 2 : Entrepôt de données"]),
  (C+"dw/Chapitre 3 DataWarehouse.pdf", "chapitre-3-datawarehouse.pdf", "course", ["Chapter 3: Data warehouse", "Chapitre 3 : Entrepôt de données"]),
  (C+"dw/Chapitre 4 Mise en Place et Administration des  Outils Microsoft.pdf", "chapitre-4-outils-microsoft.pdf", "course", ["Chapter 4: Setting up and administering the Microsoft tools", "Chapitre 4 : Mise en place et administration des outils Microsoft"]),
  (C+"dw/Chapitre 5 Atelier dinitiation avec SSIS.pdf", "chapitre-5-atelier-ssis.pdf", "course", ["Chapter 5: SSIS starter workshop", "Chapitre 5 : Atelier d'initiation avec SSIS"]),
  (C+"dw/Série 1 Approche descendante.pdf", "serie-1-approche-descendante.pdf", "tdtp", ["Exercise sheet 1: Top-down approach", "Série 1 : Approche descendante"]),
  (C+"exams/dw/DS_2024_Entrepot.pdf", "ds-2024-entrepot.pdf", "exams", ["DS 2024: Data warehouse (Entrepôt de données)", "DS 2024 : Entrepôt de données"]),
  (C+"dw/clients.txt", "ssis-clients.txt", "other", ["Lab data: clients.txt", "Données d'atelier : clients.txt"]),
  (C+"dw/customer.txt", "ssis-customer.txt", "other", ["Lab data: customer.txt", "Données d'atelier : customer.txt"]),
  (C+"dw/sauv_gestion_livres.bak", "sauv-gestion-livres.bak.zip", "other", ["SQL Server backup: sauv_gestion_livres.bak (zipped)", "Sauvegarde SQL Server : sauv_gestion_livres.bak (zip)"], True),
  (C+"dw/sauvegardeED.baK", "sauvegarde-ed.bak.zip", "other", ["SQL Server backup: sauvegardeED.bak (zipped)", "Sauvegarde SQL Server : sauvegardeED.bak (zip)"], True),
  (C+"dw/sauvegardeSource.bak", "sauvegarde-source.bak.zip", "other", ["SQL Server backup: sauvegardeSource.bak (zipped, 70 MB unzipped)", "Sauvegarde SQL Server : sauvegardeSource.bak (zip, 70 Mo décompressé)"], True),
 ],
 "pcp": [
  (C+"pcp/ParalleleJava_IIT_2026.pdf", "cours-parallele-java.pdf", "course", ["Course: Introduction, threads in Java", "Cours : Introduction, threads en Java"]),
  (C+"pcp/Semaphore_2026.pdf", "cours-semaphore.pdf", "course", ["Course: Semaphores", "Cours : Sémaphores"]),
  (C+"pcp/Moniteur.pdf", "cours-moniteur.pdf", "course", ["Course: Monitors", "Cours : Moniteurs"]),
  (C+"pcp/TD1_parallele_IIT.pdf", "td1-semaphore.pdf", "tdtp", ["TD1: Semaphores", "TD1 : Sémaphores"]),
  (C+"pcp/DS_2024_Programmation.pdf", "ds-2024-pcp.pdf", "exams", ["DS 2024 (4 Nov 2024)", "DS 2024 (04/11/2024)"]),
  (C+"pcp/DS parallele CS 2024.pdf", "ds-2024-pcp-cs.pdf", "exams", ["DS 2024, second paper (Révision folder)", "DS 2024, deuxième sujet (dossier Révision)"]),
 ],
 "pads": [
  (C+"pads/IIT_PADS_Activité1_Séance1-Student.ipynb", "activite1-seance1-rappel-python.ipynb", "course", ["Activity 1, session 1: Python refresher (notebook)", "Activité 1, séance 1 : Rappel Python (notebook)"]),
  (C+"pads/IIT_PADS_StudentNotebook_Chapitre2_ClassePythonObjet_IIT2026-2027.ipynb", "chapitre2-classe-objet.ipynb", "course", ["Chapter 2: Classes & objects (notebook)", "Chapitre 2 : Classe & objet (notebook)"]),
  (C+"pads/IIT_PADS_StudentNotebook_Chapitre2_ClassePythonObjet_IIT2026-2027-suite.ipynb", "chapitre2-classe-objet-suite.ipynb", "course", ["Chapter 2 (continued): Classes & objects (notebook)", "Chapitre 2 (suite) : Classe & objet (notebook)"]),
  (C+"pads/IIT_PADS_Student_Chapitre_2_6_dataclass.ipynb", "chapitre2-6-dataclass.ipynb", "course", ["Chapter 2.6: dataclass (notebook)", "Chapitre 2.6 : dataclass (notebook)"]),
  (C+"pads/IIT_Student_Chapitre_3_Heritage_Polymorphisme_Surcharge_2SDIA.ipynb", "chapitre3-heritage-polymorphisme-surcharge.ipynb", "course", ["Chapter 3: Inheritance, polymorphism, overloading (notebook)", "Chapitre 3 : Héritage, polymorphisme, surcharge (notebook)"]),
  (C+"pads/TP1_PADS_IIT2026-2027.pdf", "tp1-poo.pdf", "tdtp", ["TP1: OOP lab", "TP1 : POO"]),
 ],
}
TYPES = {".pdf": "PDF", ".ipynb": "Notebook", ".csv": "CSV", ".xlsx": "Excel", ".zip": "ZIP", ".txt": "TXT"}
man = {}; total = 0
for sid, items in F.items():
    out = os.path.join(ROOT, "files", sid); os.makedirs(out, exist_ok=True)
    keep = set(); man[sid] = []
    for it in items:
        src, name, grp, title = it[:4]; z = len(it) > 4 and it[4]
        dst = os.path.join(out, name); keep.add(name)
        if not os.path.exists(dst):
            if z:
                with zipfile.ZipFile(dst, "w", zipfile.ZIP_DEFLATED, compresslevel=9) as zf: zf.write(src, os.path.basename(src))
            else: shutil.copyfile(src, dst)
        sz = os.path.getsize(dst); total += sz
        if sz > 50 * 2**20: print("WARN >50MB", dst, file=sys.stderr)
        if sz > 95 * 2**20: raise SystemExit("too big: " + dst)
        ext = os.path.splitext(name)[1]
        man[sid].append({"f": "files/%s/%s" % (sid, name), "g": grp, "t": title, "type": TYPES.get(ext, ext[1:].upper()), "size": sz, "orig": os.path.basename(src)})
    for n in os.listdir(out):
        if n not in keep: os.remove(os.path.join(out, n))
with open(os.path.join(ROOT, "assets", "files.js"), "w", encoding="utf-8") as fh:
    fh.write("/* Generated by tools/build_files.py: course files hosted in files/<subject>/. */\nwindow.FILES = " + json.dumps(man, ensure_ascii=False, indent=1) + ";\n")
for sid in man: print(sid, len(man[sid]), sum(x["size"] for x in man[sid]))
print("total", total)
