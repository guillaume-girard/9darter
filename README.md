# 9darter
Application permettant de compter les points aux jeux de fléchettes. Utile lorsque la cible n'est pas électronique. 

## Git "Flow" du projet
### Branches
- Branche ***develop*** : accueille les développements en cours
    * tests non réalisés (ou partiellement)
    * peut être à un stade où l'application ne fonctionne pas
    * doit être jugée opérationnelle avant merge vers *beta*
- Branche ***beta*** : accueille les développements jugés opérationnels et pouvant être mis à l'épreuve
    * les merges doivent venir de *develop*
    * cette branche a pour but d'être utilisée par les beta testeurs pour tester fonctionnellement l'application (mise à l'épreuve)
    * les bug fix se font directement sur cette branche avant merge vers *main*
- Branche ***main*** : accueille les versions stables utilisables par les utilisateurs finaux
    * les merges doivent venir de *beta*
    * peut être utilisée pour des commit de hotfix
    * chaque merge de *beta* vers cette branche fait l'objet d'un nouveau *tag* de version

### Tags de version

Format utilisé :  
> __vX.Y\[.Z\]__
- X : incrémenté lors d'une mise à jour majeure (nouveau design, nouveau paradigme, nouveau langage/framework, fonctionnalité modifiant drastiquement l'usage de l'appli (ex : jeu en ligne), ...)
- Y : incrémenté lors d'une mise à jour mineure (nouvelle fonctionnalité, nouveau jeu implémenté, modification légère de l'UI/UX, ...)
- Z (optionnel) : incrémenté lors de corrections de bugs ou lors de modifications invisibles par l'utilisateur (optimisation de code, gain de performance, modifications liées aux tests, ...)

## Roadmap
Utiliser le [trello](https://trello.com/b/2hxsLkAm/9darter) pour déclarer et organiser les fonctionnalités/développements à réaliser.  
Les [issues Git](https://github.com/guillaume-girard/9darter/issues) ne doivent recenser que les *bugs* et les *optimisations* du code.

## Issues

### Bugs
Les bugs trouvés sur l'application sont caractérisés par un niveau de sévérité et un niveau de priorité, correspondant aux labels dans les issues GitHub définis comme suit :

__Sévérité__
- ***Critique*** : empêche le bon fonctionnement de l'application
- ***Majeur*** : n'empêche pas le bon fonctionnement de l'application mais nuit à l'expérience utilisateur
- ***Mineur*** : bug non visible pour l'utilisateur

__Priorité__
- ***Haute*** : devrait être corrigé dès que possible
- ***Moyenne*** : devrait être corrigé
- ***Basse*** : peut ne pas être corrigé

### Optimisations
Les optimisations sont caractérisée par leur niveau d'utilité dans le projet, correspondant à 3 labels différents et définis comme suit :
- ***Must have*** : l'optimisation simplifie drastiquement l'implémentation de futures fonctionnalités 
- ***Should have*** : cette optimisation permettrait d'améliorer sensiblement le code ou l'application
- ***Mmmh!*** : optimisation permettant de se caresser les tétons

