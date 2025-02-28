export const fr = {
  auth: {
    welcomeBack: "Bon retour parmi nous",
    loginToContinue: "Connectez-vous pour continuer",
    createAccount: "Créer un compte",
    registerToContinue: "Inscrivez-vous pour commencer",
    email: "Email",
    password: "Mot de passe",
    username: "Nom d'utilisateur",
    signIn: "Se connecter",
    signUp: "S'inscrire",
    orContinueWith: "Ou continuer avec",
    alreadyHaveAccount: "Déjà un compte ?",
    noAccount: "Pas encore de compte ?",
    verifyEmail: {
      title: "Vérifiez votre email",
      description: "Un email de vérification a été envoyé à",
      resend: "Renvoyer l'email",
      resendIn: "Renvoyer l'email dans",
      seconds: "secondes",
      checkInbox:
        "Vérifiez votre boîte de réception et cliquez sur le lien de vérification.",
      success: "Email de vérification envoyé avec succès",
    },
    errors: {
      invalidCredentials: "Email ou mot de passe invalide",
      googleError: "Impossible de se connecter avec Google",
      registrationError: "Impossible de créer le compte",
      genericError: "Une erreur est survenue",
      emailAlreadyInUse: "Cet email est déjà utilisé",
      weakPassword: "Le mot de passe est trop faible",
      invalidEmail: "L'email n'est pas valide",
      verificationEmailError: "Impossible d'envoyer l'email de vérification",
      default: "Une erreur est survenue",
    },
  },
  common: {
    loading: "Chargement...",
    error: "Erreur",
    retry: "Réessayer",
    home: "Accueil",
    back: "Retour",
    logout: "Déconnexion",
    cancel: "Annuler",
    create: "Créer",
    appName: "BlaBla",
    appDescription: "Application de discussions",
    copyright: "© 2023 BlaBla App",
  },
  sidebar: {
    expandMenu: "Développer le menu",
    collapseMenu: "Réduire le menu",
    closeMenu: "Fermer le menu",
  },
  categories: {
    title: "Catégories",
    create: "Créer une catégorie",
    createNew: "Créer une nouvelle catégorie",
    categoryName: "Nom de la catégorie",
    categoryNamePlaceholder: "Ex: Sports, Technologie, Cuisine...",
    errors: {
      nameRequired: "Le nom de la catégorie est requis",
      loginRequired: "Vous devez être connecté pour créer une catégorie",
      createError:
        "Une erreur est survenue lors de la création de la catégorie",
    },
  },
  threads: {
    title: "Discussions",
    create: "Créer une discussion",
    createNew: "Créer une nouvelle discussion",
    empty: "Aucune discussion dans cette catégorie",
    select:
      "Sélectionnez une discussion dans le panneau de droite pour afficher ses messages.",
    lastActivity: "Dernière activité",
    threadName: "Nom de la discussion",
    threadNamePlaceholder: "Ex: Question sur..., Discussion à propos de...",
    creatingInCategory: "Dans la catégorie:",
    errors: {
      nameRequired: "Le nom de la discussion est requis",
      categoryRequired: "La catégorie est requise",
      loginRequired: "Vous devez être connecté pour créer une discussion",
      createError:
        "Une erreur est survenue lors de la création de la discussion",
      categoryNotFound:
        "La catégorie spécifiée n'existe pas ou a été supprimée",
    },
  },
  theme: {
    toggleLight: "Passer en mode clair",
    toggleDark: "Passer en mode sombre",
  },
  errors: {
    notFound: {
      title: "404",
      heading: "Page introuvable",
      description: "Oups ! La page que vous recherchez semble avoir disparu.",
    },
    server: {
      title: "500",
      heading: "Erreur serveur",
      description:
        "Oups ! Il semble qu'un problème est survenu sur nos serveurs.",
    },
    critical: {
      title: "Erreur",
      heading: "Erreur critique",
      description:
        "Une erreur inattendue s'est produite. Nous travaillons à la résoudre.",
    },
  },
} as const;

export type Translation = typeof fr;

// Type helper pour s'assurer que toutes les clés sont présentes dans les autres langues
export type TranslationKeys = keyof Translation;
