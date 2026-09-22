# Étude Détaillée — Plateforme Modulaire de Gestion des Cabinets Juridiques (Algérie)
### Avocat • Notaire • Huissier de Justice • Écrivain Public

**Document destiné à un agent IA de développement — cahier des charges de démarrage**
**Version :** 1.0 — **Date :** 25/07/2026 — **Contexte :** République Algérienne Démocratique et Populaire

---

## 1. Vision du projet

Construire **un seul système logiciel modulaire**, vendu comme produit unique, dans lequel **le client (cabinet)** active uniquement les **modules métiers correspondant à sa profession réglementée** :

1. **Avocat** (cabinet d'avocat / société d'avocats)
2. **Notaire** (office public notarial)
3. **Huissier de justice** (office d'huissier de justice, incluant depuis 2023 les attributions du commissaire-priseur)
4. **Écrivain public**

Le **vendeur du projet (vous)** joue le rôle de **Super-Admin / Éditeur** : il crée les comptes cabinets (tenants), **active ou désactive les modules** selon l'abonnement souscrit, et supervise l'ensemble des instances.

Le système doit être :
- **Multi-tenant** (plusieurs cabinets indépendants sur une même plateforme, données cloisonnées).
- **Multilingue** : Arabe (RTL), Français, Anglais — avec l'arabe comme langue légale de référence pour les actes de certaines professions (voir §7).
- **Conforme au droit algérien** (voir §5).
- Développé en **ASP.NET Core (Web API)** + **React (front-end SPA)**.

---

## 2. Contexte légal algérien (socle de l'étude)

Chaque profession est une **profession réglementée**, encadrée par une loi spécifique. Le système doit refléter la réalité métier et documentaire de chacune.

| Profession | Texte de référence | Statut | Autorité de tutelle | Organe professionnel |
|---|---|---|---|---|
| Avocat | Loi n° 13-07 du 29/10/2013 | Profession libérale et indépendante | Ministère de la Justice | Barreaux / Union nationale des ordres des avocats |
| Notaire | Loi n° 06-02 du 20/02/2006 | Officier public, mandaté par l'État (office public notarial) | Ministère de la Justice, Garde des Sceaux | Chambre nationale des notaires / Conseil supérieur du notariat |
| Huissier de justice | Loi n° 06-03 du 20/02/2006, modifiée par la Loi n° 23-13 du 05/08/2023 (intégration du commissaire-priseur) | Officier public et ministériel | Ministère de la Justice, sous contrôle du Procureur de la République | Chambre nationale des huissiers de justice |
| Écrivain public | Circulaire n° 23 du 07/09/1971 (autorisation du wali) | Activité autorisée, non un ordre professionnel structuré | Wilaya (via `prestations.interieur.gov.dz`) | Aucun ordre légal formel — associations informelles |

**Points structurants tirés de la loi, à intégrer dans le design fonctionnel :**

- **Avocat** : missions = représentation/assistance/défense, consultations juridiques, tous actes de procédure, **diligence de l'exécution des décisions de justice** (l'avocat est dispensé de procuration formelle pour agir). Formes d'exercice : individuel, société d'avocats, cabinet groupé, collaboration, salariat.
- **Notaire** : rédige des **actes authentiques** (contrat de vente, donation, testament, contrat de mariage, procuration, etc.), tient un **répertoire des actes** coté et paraphé, conserve **minutes, brevets, grosses et expéditions**, doit motiver tout refus de rédaction d'acte, secret professionnel strict, gestion d'archives notariales réglementée. Le Code de l'enregistrement impose des **états récapitulatifs** transmis au bureau de l'enregistrement, avec **NIN (numéro d'identification national)** des parties.
- **Huissier de justice** : **signification des actes/exploits**, exécution forcée des jugements et actes notariés, procès-verbaux (carence, saisie conservatoire, saisie-arrêt, saisie-revendication, saisie-exécution), sommations interpellatives, service audiencier. **Les actes doivent être rédigés en langue arabe.** Barème d'honoraires réglementé par décret (ex. sommation interpellative, PV de carence, etc. — tarifs fixes). Depuis 2023, gère aussi les ventes aux enchères (ex-commissaire-priseur) et doit respecter des obligations de lutte contre le blanchiment d'argent.
- **Écrivain public** : rédaction de courriers/formulaires administratifs pour des tiers, retrait de documents administratifs, demandes de visa, gestion d'envois postaux — activité **non réglementée par un ordre**, simple **autorisation du wali**, donc le module doit rester **simple et flexible** (pas de contraintes de répertoire légal comme le notariat).

- **Loi n° 18-07 du 10/06/2018** relative à la protection des personnes physiques dans le traitement des données à caractère personnel (équivalent RGPD algérien) :
  - Consentement, finalité, minimisation des données.
  - **Interdiction de transfert de données personnelles vers l'étranger** (hébergement obligatoire en Algérie ou dérogation ANPDP).
  - Déclaration des traitements auprès de l'**ANPDP** (Autorité Nationale de Protection des Données Personnelles) avant mise en œuvre.
  - Droits des personnes : accès, rectification, suppression, opposition.
- **Loi n° 18-05** relative au commerce électronique (cadre pour signature électronique et transactions en ligne, dans la mesure où le système intègre paiement/facturation en ligne).

**Conséquence directe sur l'architecture technique** : hébergement des données en Algérie (ou infrastructure locale/datacenter certifié), registre des traitements exposé pour audit, et **aucune dépendance à un cloud storage hors Algérie pour les données personnelles** sans mécanisme de conformité.

---

## 3. Principe d'architecture fonctionnelle : Socle commun + Modules activables

### 3.1 Modèle d'activation (rôle du vendeur / Super-Admin)

- Le vendeur crée un **Tenant** (cabinet) et lui assigne un **plan d'abonnement**.
- Le plan détermine quels modules métiers sont actifs : `Avocat`, `Notaire`, `Huissier`, `EcrivainPublic` (un cabinet peut en théorie cumuler plusieurs professions si autorisé — mais en pratique un office = une profession ; prévoir tout de même la flexibilité technique).
- Chaque module a ses propres **fonctionnalités, terminologie, workflows et champs de données**, mais tous s'appuient sur un **socle commun** (Core).
- Le Super-Admin peut : activer/désactiver un module à tout moment, définir des quotas (utilisateurs, dossiers, stockage), suspendre un tenant, consulter des statistiques d'usage global (sans accéder aux données métier confidentielles des cabinets — respect du secret professionnel).

### 3.2 Socle commun (Core) — utilisé par les 4 modules

- **Gestion des utilisateurs & rôles** (RBAC) par cabinet : Titulaire/Officier public, Collaborateur/Clerc, Stagiaire, Secrétaire/Assistant, Comptable.
- **Gestion des clients/tiers** (personnes physiques et morales), avec numéro d'identification national (NIN), registre du commerce pour les personnes morales.
- **Gestion des dossiers** (dossier générique, sous-typé par module).
- **Gestion documentaire** (GED) : upload, versionning, modèles de documents (templates), génération de documents Word/PDF.
- **Agenda & rendez-vous**, rappels, échéances légales (délais de procédure, dates d'audience, dates de signature).
- **Facturation & honoraires**, encaissements, état des comptes clients.
- **Comptabilité simplifiée** (registre des recettes/dépenses, conforme aux obligations fiscales algériennes de base).
- **Messagerie interne & notifications** (email, SMS, notifications in-app).
- **Recherche globale** (dossiers, clients, documents, actes).
- **Journal d'audit** (traçabilité de toute action — critique pour les officiers publics).
- **Gestion multilingue de l'interface et des documents** (AR/FR/EN).
- **Tableau de bord** (KPIs : dossiers en cours, échéances proches, chiffre d'affaires, actes en attente de signature).
- **Paramétrage cabinet** (en-tête, cachet/logo, coordonnées, barème d'honoraires interne).

### 3.3 Modules métiers spécifiques

#### Module Avocat
- Gestion de **dossiers contentieux et de conseil**, avec sous-types (civil, pénal, commercial, social, administratif, famille).
- Suivi de **procédure** : juridiction saisie, numéro de rôle, calendrier des audiences, décisions rendues, voies de recours (appel, cassation) avec délais légaux calculés automatiquement.
- Gestion des **mandats/pouvoirs** (même si l'avocat est dispensé de procuration formelle, le suivi interne du mandat client reste utile).
- Rédaction de **consultations juridiques**, mémoires, conclusions, assignations — via modèles.
- Suivi de l'**exécution des décisions de justice** obtenues (lien avec un huissier si besoin — passerelle inter-module).
- Facturation à l'acte, au forfait, ou aux honoraires de résultat (pacte de quota litis encadré).
- Gestion de la relation avec le **Barreau** (paiement cotisations, suivi du tableau).

#### Module Notaire
- **Répertoire des actes** numérique (obligation légale : registre coté/paraphé — le système doit produire une numérotation séquentielle inviolable, horodatée, non modifiable a posteriori, exportable/imprimable pour dépôt légal).
- Typologie d'actes : vente immobilière, donation, testament, contrat de mariage, procuration authentique, acte de notoriété (« fredha »), constitution de société, etc.
- Gestion des **minutes, brevets, grosses et expéditions** (distinction claire dans le système entre l'original conservé — minute — et les copies délivrées).
- **Formalités liées** : publicité foncière, enregistrement (interface/état récapitulatif pour le bureau de l'enregistrement, avec NIN des parties), calcul des droits d'enregistrement.
- Gestion des **archives notariales** avec règles de conservation réglementaires (durées légales).
- Workflow de signature en présence des parties (+ option procuration à distance/visioconférence si un cadre légal équivalent existe).
- Gestion des consultations juridiques données aux parties (article 13 de la loi 06-02).

#### Module Huissier de Justice
- Gestion des **actes de signification** (assignations, citations, notifications de décisions) avec **procès-verbal type** (nom, prénom, adresse professionnelle, timbre, signature de l'huissier, date/heure).
- Gestion des **procédures d'exécution forcée** : saisie conservatoire, saisie-arrêt, saisie-revendication, saisie-exécution, sommation interpellative, procès-verbal de carence.
- **Barème d'honoraires réglementé** intégré (tarifs fixes par type d'acte, actualisables par le Super-Admin lors de mise à jour légale).
- **Rédaction obligatoire en langue arabe** des actes et exploits → le module doit imposer/prioriser la génération de documents en arabe (avec traduction FR interne pour usage cabinet si besoin).
- Suivi du **service audiencier** (missions auprès des juridictions).
- Module **ventes aux enchères / commissariat-priseur** (suite à la loi 23-13) : inventaire des biens, publicité de la vente, gestion des enchérisseurs, procès-verbal d'adjudication.
- Registre de conformité anti-blanchiment (traçabilité des flux financiers importants, déclaration de soupçon si applicable).

#### Module Écrivain Public
- Module volontairement **plus léger et flexible** (absence de cadre réglementaire strict type ordre professionnel).
- Gestion de **demandes/commandes** : rédaction de courriers, remplissage de formulaires administratifs, demandes de visa, suivi d'envois postaux, photocopies.
- Fiche client simple + historique des prestations.
- Bibliothèque de **modèles de courriers/formulaires administratifs algériens courants** (CNAS, CASNOS, wilaya, état civil, etc.).
- Facturation simplifiée à la prestation.
- Traçabilité de l'autorisation d'exercice (numéro d'autorisation du wali, date, wilaya).

### 3.4 Interconnexions inter-modules (valeur ajoutée produit)
- Un dossier avocat peut **générer une demande d'exécution** transmise à un module huissier (si le cabinet cumule, ou via un flux d'échange inter-cabinets).
- Un acte notarié peut nécessiter une **signification par huissier** (passerelle documentaire).
- Répertoire clients partagé au sein d'un même cabinet multi-module (dédoublonnage).

---

## 4. Rôle du vendeur / Super-Admin (acteur pivot du besoin #2)

En tant que porteur du projet, votre rôle central définit un **cinquième « module » transverse** : la **Console d'Administration Globale (Back-Office SaaS)**.

**Besoins fonctionnels du Super-Admin :**
- Créer/suspendre/supprimer des tenants (cabinets).
- Activer/désactiver dynamiquement chaque module par tenant, sans redéploiement (feature flags pilotés en base de données).
- Définir des plans tarifaires (nombre d'utilisateurs, modules inclus, quotas de stockage, limite de dossiers).
- Facturer les cabinets clients (abonnement SaaS), suivre les paiements.
- Superviser la santé technique de la plateforme (logs, erreurs, usage), sans accès aux données métier confidentielles (cloisonnement strict — secret professionnel).
- Gérer les mises à jour des référentiels légaux communs (barèmes d'honoraires huissier, taux d'enregistrement notarial, modèles de documents officiels) que tous les tenants utilisant ce module recevront.
- Gérer les traductions AR/FR/EN de l'interface et des modèles de documents.
- Support client (tickets), audit de conformité (export du registre des traitements pour l'ANPDP si demandé).

---

## 5. Exigences non-fonctionnelles

| Catégorie | Exigence |
|---|---|
| **Conformité légale** | Respect Loi 18-07 (données personnelles) : hébergement en Algérie, consentement, droits d'accès/rectification/suppression, registre des traitements exportable. |
| **Langue des actes** | Génération d'actes/documents officiels en **arabe obligatoire** pour huissier ; arabe/français au choix pour notaire et avocat selon usage cabinet ; interface entièrement traduisible AR/FR/EN. |
| **RTL** | Le front React doit gérer nativement le **RTL complet** pour l'arabe (layout, formulaires, PDF générés). |
| **Sécurité** | Authentification forte (MFA optionnelle), chiffrement au repos et en transit, isolation stricte des données par tenant (multi-tenant avec `TenantId` sur chaque entité + row-level security), secret professionnel = cloisonnement absolu inter-cabinets. |
| **Intégrité documentaire** | Numérotation séquentielle inviolable pour le répertoire notarial et les actes d'huissier (append-only / hash de vérification), horodatage certifié. |
| **Disponibilité** | SLA élevé (les échéances judiciaires sont critiques — indisponibilité = risque de forclusion). |
| **Auditabilité** | Journal d'audit immuable de toute action sur un dossier/acte (qui, quand, quoi). |
| **Performance** | Recherche full-text rapide sur dossiers/documents/clients (même en grand volume, archives sur plusieurs années). |
| **Interopérabilité** | Export PDF/A pour archivage légal, export Word éditable, API ouverte pour interconnexion future (ex. plateformes gouvernementales `interieur.gov.dz`, service d'enregistrement). |
| **Accessibilité/UX** | Interface simple pour utilisateurs peu à l'aise avec l'informatique (profil huissier/écrivain public souvent non technophile) ; mode hors-ligne partiel pour les huissiers en déplacement (signification sur le terrain). |
| **Sauvegarde & archivage** | Politique de rétention conforme aux durées légales de conservation des minutes/répertoires notariaux et actes d'huissier. |
| **Scalabilité** | Architecture multi-tenant capable de monter en charge (plusieurs milliers de cabinets à terme). |

---

## 6. Exigences fonctionnelles transverses (résumé priorisé)

### Must-have (MVP)
1. Authentification multi-tenant + RBAC.
2. Console Super-Admin : création tenant, activation modules, gestion abonnement.
3. Socle Core : clients/tiers, dossiers, documents (GED), agenda, facturation basique.
4. Module Avocat MVP : dossiers, échéances audiences, documents.
5. Module Notaire MVP : répertoire des actes (numérotation légale), typologie d'actes de base, GED.
6. Module Huissier MVP : actes de signification + PV standard, barème d'honoraires.
7. Module Écrivain Public MVP : commandes/prestations, modèles de courriers.
8. Interface multilingue AR (RTL)/FR/EN.
9. Génération PDF des documents/actes.
10. Journal d'audit basique.

### Should-have (V2)
- Facturation avancée + comptabilité, tableau de bord analytique.
- Passerelles inter-modules (avocat → huissier).
- Gestion des ventes aux enchères (module huissier).
- Signature électronique intégrée (conforme loi 18-05).
- Notifications SMS/Email automatisées sur échéances.
- Mode hors-ligne (PWA) pour huissiers.

### Could-have (V3)
- Portail client (le justiciable suit l'avancement de son dossier).
- Intégration avec futurs services e-gov algériens (enregistrement, publicité foncière).
- Statistiques et reporting avancés pour les ordres professionnels (si partenariat).
- IA d'aide à la rédaction d'actes/documents (génération assistée, sous contrôle humain).

---

## 7. Modèle de données (entités clés — vue haut niveau)

```
Tenant (Cabinet)
 ├─ TenantModules (Avocat | Notaire | Huissier | EcrivainPublic — actif/inactif)
 ├─ Users (rôles: TitulaireOfficier, Collaborateur, Secretaire, Comptable, SuperAdmin)
 ├─ Client/Tiers (PersonnePhysique | PersonneMorale, NIN, RC)
 ├─ Dossier (générique)
 │   ├─ DossierAvocat (juridiction, numéroRole, typeAffaire, audiences[])
 │   ├─ ActeNotarie (typeActe, numeroRepertoire, minute, statutEnregistrement)
 │   ├─ ActeHuissier (typeActe, numeroPV, langue=Arabe, partiesSignifiees[])
 │   └─ PrestationEcrivainPublic (typePrestation, statut)
 ├─ Document (versionné, lié à Dossier, templateId)
 ├─ Facture / Paiement
 ├─ Evenement (Agenda, échéance, rappel)
 ├─ AuditLog (immuable)
 └─ ModeleDocument (par module, par langue)
```

---

## 8. Architecture technique proposée

- **Back-end** : ASP.NET Core (dernière LTS), API REST (ou GraphQL en complément pour les vues complexes), architecture **Clean Architecture / DDD** avec séparation Core (socle commun) et modules métiers en tant que **plugins/assemblies séparés** chargés selon les modules activés du tenant.
- **Multi-tenancy** : stratégie hybride — base de données partagée avec `TenantId` + row-level isolation, ou schéma séparé par tenant pour les gros comptes (à trancher en phase de conception détaillée).
- **Base de données** : SQL Server ou PostgreSQL (hébergement Algérie).
- **Authentification** : ASP.NET Identity + JWT, MFA optionnelle, gestion fine des permissions par module/rôle.
- **Front-end** : React (TypeScript recommandé), state management (Redux/Zustand), i18n via `react-i18next` (support RTL natif pour l'arabe), génération PDF côté serveur (ex. QuestPDF / DinkToPdf) pour garantir la fidélité des actes officiels.
- **Génération de documents** : moteur de templates (Word/PDF) avec fusion de données dossier → document légal.
- **Stockage documentaire** : stockage objet chiffré, hébergé en Algérie (contrainte loi 18-07).
- **Notifications** : service d'email (SMTP local ou provider conforme) + SMS (gateway algérien).
- **CI/CD** : pipeline de déploiement continu, environnements Dev/Staging/Prod isolés.
- **Journalisation & monitoring** : centralisé, avec alerting sur échéances critiques.

---

## 9. Rôles utilisateurs (RBAC global)

| Rôle | Portée | Description |
|---|---|---|
| Super-Admin | Plateforme entière | Vendeur/éditeur — gestion tenants, modules, abonnements |
| Admin Cabinet (Titulaire/Officier public) | Un tenant | Gère utilisateurs, paramètres, valide les actes |
| Collaborateur/Clerc | Un tenant, dossiers assignés | Rédige, prépare, mais ne signe/valide pas un acte officiel |
| Secrétaire/Assistant | Un tenant | Agenda, accueil client, saisie administrative |
| Comptable | Un tenant | Facturation, encaissements, reporting financier |
| Client (optionnel V3) | Portail limité | Consultation de l'avancement de son dossier |

---

## 10. Prochaines étapes recommandées pour l'agent IA de développement

1. **Valider le modèle multi-tenant** (base partagée vs isolée) avec l'équipe avant de coder le Core.
2. Développer le **socle Core** en premier (auth, tenants, RBAC, clients, dossiers génériques, GED, agenda).
3. Développer le **module Notaire** en second si c'est la priorité commerciale (le plus contraint légalement, donc le plus structurant pour valider l'architecture "répertoire inviolable").
4. Mettre en place le **système i18n AR/FR/EN + RTL** dès le squelette front, car c'est structurellement coûteux à ajouter après coup.
5. Construire la **console Super-Admin** en parallèle du Core (elle pilote l'activation des modules dès les premiers tests).
6. Élaborer une **bibliothèque de modèles de documents légaux algériens** par module (à collecter/valider auprès de professionnels du domaine — ce sont des documents réels, pas générés depuis zéro).
7. Prévoir des **tests de conformité** : numérotation séquentielle non modifiable, journal d'audit, purge/export des données personnelles.

---

## 11. Points à clarifier avec le porteur de projet (vous) avant le développement

- Un cabinet peut-il cumuler plusieurs modules (ex. un office qui serait à la fois avocat et écrivain public), ou un tenant = une seule profession stricte ?
- Le portail client fait-il partie du périmètre V1 ou seulement V3 ?
- Modèle d'hébergement : datacenter algérien dédié, cloud local certifié, ou infrastructure on-premise chez les gros cabinets ?
- Intégration prévue avec des plateformes e-gov algériennes existantes (`interieur.gov.dz`, services d'enregistrement) dès le MVP ou plus tard ?
- Modèle de tarification SaaS exact (par module, par utilisateur, par volume de dossiers) à refléter dans la console Super-Admin ?

---

*Sources légales consultées : Loi n° 13-07 (avocat), Loi n° 06-02 (notaire), Loi n° 06-03 modifiée par Loi n° 23-13 (huissier de justice), Circulaire n° 23/1971 (écrivain public), Loi n° 18-07 (protection des données personnelles), Code de l'enregistrement algérien. Ce document est une base de travail fonctionnelle et ne remplace pas une consultation juridique formelle — il est recommandé de faire valider les workflows métiers par un professionnel de chaque profession avant mise en production.*
