# SAE 301 – Développement d’un site E-commerce "Click & Collect"

## Présentation
Ce projet a été réalisé dans le cadre du **BUT MMI (Métiers du Multimédia et de l’Internet)**.  
La SAE (Situation d’Apprentissage et d’Évaluation) permet aux étudiants de mobiliser leurs compétences en **design, développement web, gestion de projet et communication** à travers des cas concrets.  
Chaque SAE s’inscrit dans une logique d’apprentissage par la pratique et vise à simuler des situations professionnelles.

---

## Objectif du projet
La SAE 301 avait pour objectif la **conception et le développement d'une application web "Click & Collect"** pour l’enseigne **LUKURË**.  
Ce projet individuel devait respecter la **charte graphique** et l’**identité visuelle** de la marque, tout en proposant une **expérience utilisateur optimisée** pour la commande en ligne.

### Enjeux techniques
- Gestion d’un **catalogue produits**
- **Panier persistant** entre les visites
- Processus de commande complet (sans paiement réel)
- Fonctionnalités avancées : gestion des stocks, variantes de produits, interface d’administration

---

## Technologies utilisées
- **HTML / JavaScript** : structure sémantique et interactivité côté client  
- **Tailwind CSS** : intégration responsive rapide et fidèle au Design System  
- **PHP** : architecture backend et logique métier  
- **SQL (MySQL)** : gestion de la base de données (produits, utilisateurs, commandes, stocks)  
- **Figma** : phase de webdesign, prototypage et maquettage (UI/UX)  
- **Git / GitHub** : versionning et gestion des itérations  

---

## Méthodologie
Projet réalisé sur une période intensive de **2 semaines**, structuré par une approche **Agile** basée sur des **User Stories (US)** :

1. **Phase d’Analyse et Design**  
   - Étude de l’identité de LUKURË  
   - Conception des parcours utilisateurs (UX)  
   - Création des maquettes sur Figma  
   - Intégration des composants via Tailwind CSS  

2. **Phase de Développement (MVP)**  
   - Mise en place de l’architecture PHP  
   - Développement du catalogue produits  
   - Authentification client  
   - Panier persistant  

3. **Phase de Perfectionnement**  
   - Options produits et gestion des stocks en temps réel  
   - Interface d’administration complète  

---

## Fonctionnalités développées

### Front-Office (Client)
- Consultation du catalogue avec filtrage par catégories  
- Fiches produits détaillées avec options (contenants, types de soins, etc.)  
- Création de compte et espace personnel sécurisé  
- Panier d’achat persistant  
- Simulation de commande et historique des achats  
- Possibilité de ré-commander en un clic  
- Gestion des stocks en temps réel (produits épuisés non commandables)  

### Back-Office (Administrateur)
- Dashboard de suivi de l’activité commerciale  
- Gestion des commandes (statuts : en cours, disponible, retirée)  
- Impact automatique sur les stocks lors de la validation ou annulation  

---

## Remarques
Ce projet est un **prototype pédagogique** réalisé dans le cadre du BUT MMI.  
Il n’est pas destiné à une mise en production commerciale, mais démontre la capacité à développer une **solution e-commerce complète**, de la base de données à l’interface utilisateur, en respectant les contraintes techniques et l’univers graphique raffiné de la marque **LUKURË**.
