import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  // Méthode statique qui met à jour l'état lorsque une erreur est détectée
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  // Vous pouvez aussi enregistrer l'erreur via un service externe
  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI en cas d'erreur
      return <h1>Quelque chose s'est mal passé.</h1>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
