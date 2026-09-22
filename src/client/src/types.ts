export type ModuleType = 'Avocat' | 'Notaire' | 'Huissier' | 'EcrivainPublic';
export type UserType = 'SuperAdmin' | 'AdminCabinet' | 'Collaborateur' | 'Secretaire' | 'Comptable';
export type DossierStatus = 'Ouvert' | 'EnCours' | 'Suspendu' | 'Cloture' | 'Archive';
export type PersonType = 'Physique' | 'Morale';
export type PaymentStatus = 'Pending' | 'Completed' | 'Failed' | 'Refunded';

export interface User {
  id: string;
  tenantId: string;
  email: string;
  fullName: string;
  role: UserType;
  cabinetName?: string;
  activeModules?: ModuleType[];
}

export interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  activeModules: ModuleType[];
}

export interface ClientTiers {
  id: string;
  tenantId: string;
  personType: PersonType;
  firstName: string;
  lastName: string;
  fullName: string;
  nin?: string;
  dateOfBirth?: string;
  placeOfBirth?: string;
  nationality?: string;
  companyName: string;
  registerCommerceNumber?: string;
  nif?: string;
  nis?: string;
  phone: string;
  email?: string;
  address: string;
  wilaya: string;
  commune: string;
  createdAt: string;
}

export interface DossierAvocat {
  id: string;
  typeAffaire: string;
  juridiction: string;
  chambre: string;
  numeroRole: string;
  adversaire: string;
  avocatAdversaire: string;
  demandeurDefendeur: string;
}

export interface ActeNotarie {
  id: string;
  typeActe: string;
  numeroRepertoire: number;
  codeRepertoireInviolable: string;
  dateActe: string;
  formeActe: string;
  objetActe: string;
  objetActeArabe: string;
  valeurDeclaree: number;
  droitsEnregistrement: number;
  autresPartiesNIN?: string;
}

export interface ActeHuissier {
  id: string;
  typeActe: string;
  numeroPV: number;
  dateSignification: string;
  heureSignification: string;
  langueObligatoire: string;
  partieRequérante: string;
  partieSignifiée: string;
  adresseSignification: string;
  qualiteRecepteur: string;
  contingencePV: string;
  honoraireReglementaire: number;
  droitDEnregistrement: number;
  fraisDeDeplacement: number;
  totalDZD: number;
  estVenteAuxEncheres: boolean;
}

export interface PrestationEcrivain {
  id: string;
  typePrestation: string;
  intitulePrestation: string;
  destinataireAdministration: string;
  documentTemplateUtilise: string;
  tarifPrestation: number;
  estLivre: boolean;
  dateLivraison?: string;
}

export interface Dossier {
  id: string;
  tenantId: string;
  code: string;
  title: string;
  titleArabic: string;
  description: string;
  moduleType: ModuleType;
  status: DossierStatus;
  openingDate: string;
  closingDate?: string;
  clientId: string;
  clientName: string;
  assignedUserId?: string;
  createdAt: string;

  avocatDetails?: DossierAvocat;
  notaireDetails?: ActeNotarie;
  huissierDetails?: ActeHuissier;
  ecrivainDetails?: PrestationEcrivain;
}

export interface Tenant {
  id: string;
  name: string;
  legalName: string;
  professionalRegistrationNumber: string;
  wilaya: string;
  address: string;
  phone: string;
  email: string;
  headerInfo?: string;
  isActive: boolean;
  createdAt: string;
  maxUsers: number;
  maxDossiers: number;
  activeModules: ModuleType[];
}

export interface DashboardStats {
  totalClients: number;
  totalDossiers: number;
  dossiersOuverts: number;
  audiencesUpcoming: number;
  audiencesAVenir?: number;
  actesNotariesMois: number;
  actesHuissierMois: number;
  chiffreAffairesMoisDZD: number;
  facturesEnAttenteDZD: number;
  recentDossiers: Dossier[];
}

export interface Facture {
  id: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  status: PaymentStatus;
  clientId: string;
  clientName: string;
  subTotal: number;
  taxRate: number;
  taxAmount: number;
  totalAmount: number;
  paidAmount: number;
  balanceDue: number;
}
