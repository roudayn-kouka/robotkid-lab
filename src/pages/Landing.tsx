
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, EyeOff, Mail, Lock, User, Gamepad2, Plus, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Landing = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'admin' | 'teacher' | 'parent'>('admin');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    adminCode: '',
    establishment: '',
    region: '',
    city: '',
    childrenCodes: ['']
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRoleChange = (role: 'admin' | 'teacher' | 'parent') => {
    setSelectedRole(role);
    // Reset role-specific fields when changing roles
    setFormData({
      ...formData,
      adminCode: '',
      establishment: '',
      region: '',
      city: '',
      childrenCodes: ['']
    });
  };

  const addChildCode = () => {
    setFormData({
      ...formData,
      childrenCodes: [...formData.childrenCodes, '']
    });
  };

  const removeChildCode = (index: number) => {
    const newCodes = formData.childrenCodes.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      childrenCodes: newCodes.length > 0 ? newCodes : ['']
    });
  };

  const updateChildCode = (index: number, value: string) => {
    const newCodes = [...formData.childrenCodes];
    newCodes[index] = value;
    setFormData({
      ...formData,
      childrenCodes: newCodes
    });
  };

  const validateForm = () => {
    if (!isLogin && formData.password !== formData.confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas",
        variant: "destructive",
      });
      return false;
    }

    if (!isLogin && selectedRole === 'admin' && !formData.adminCode) {
      toast({
        title: "Erreur",
        description: "Le code admin est requis",
        variant: "destructive",
      });
      return false;
    }

    if (!isLogin && (selectedRole === 'teacher' || selectedRole === 'parent')) {
      if (!formData.establishment || !formData.region || !formData.city) {
        toast({
          title: "Erreur",
          description: "L'établissement, la région et la ville sont requis",
          variant: "destructive",
        });
        return false;
      }
    }

    if (!isLogin && selectedRole === 'parent') {
      const validCodes = formData.childrenCodes.filter(code => code.trim() !== '');
      if (validCodes.length === 0) {
        toast({
          title: "Erreur",
          description: "Au moins un code enfant est requis",
          variant: "destructive",
        });
        return false;
      }
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    // Simulate authentication
    toast({
      title: isLogin ? "Bienvenue !" : "Compte créé !",
      description: isLogin ? "Vous êtes connecté avec succès" : "Votre compte a été créé avec succès",
    });

    // Redirect based on role
    switch (selectedRole) {
      case 'admin':
        navigate('/admin');
        break;
      case 'teacher':
        navigate('/teacher');
        break;
      case 'parent':
        navigate('/parent');
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet via-bleu to-orange flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-white rounded-full p-3 shadow-lg">
              <Gamepad2 className="h-8 w-8 text-violet" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">RoboEdu Builder</h1>
          <p className="text-white/80">Créez des jeux éducatifs avec des robots</p>
        </div>

        {/* Authentication Card */}
        <Card className="backdrop-blur-sm bg-white/95 shadow-2xl border-0">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl text-center text-gray-800">
              {isLogin ? 'Bienvenue' : 'Créer un compte'}
            </CardTitle>
            <p className="text-center text-gray-600">
              {isLogin ? 'Connectez-vous à votre compte' : 'Inscrivez-vous pour commencer'}
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <>
                  {/* Role Selection */}
                  <div className="space-y-2">
                    <Label>Rôle</Label>
                    <Select value={selectedRole} onValueChange={handleRoleChange}>
                      <SelectTrigger className="border-gray-200 focus:border-violet focus:ring-violet">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Administrateur</SelectItem>
                        <SelectItem value="teacher">Enseignant</SelectItem>
                        <SelectItem value="parent">Parent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Name Field */}
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom complet</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Entrez votre nom complet"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="pl-10 border-gray-200 focus:border-violet focus:ring-violet"
                        required
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Entrez votre email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-10 border-gray-200 focus:border-violet focus:ring-violet"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Entrez votre mot de passe"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-10 pr-10 border-gray-200 focus:border-violet focus:ring-violet"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Confirmez votre mot de passe"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="pl-10 border-gray-200 focus:border-violet focus:ring-violet"
                        required
                      />
                    </div>
                  </div>

                  {/* Admin Code Field */}
                  {selectedRole === 'admin' && (
                    <div className="space-y-2">
                      <Label htmlFor="adminCode">Code Admin</Label>
                      <Input
                        id="adminCode"
                        name="adminCode"
                        type="text"
                        placeholder="Entrez le code admin"
                        value={formData.adminCode}
                        onChange={handleInputChange}
                        className="border-gray-200 focus:border-violet focus:ring-violet"
                        required
                      />
                    </div>
                  )}

                  {/* Teacher/Parent Fields */}
                  {(selectedRole === 'teacher' || selectedRole === 'parent') && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="establishment">Établissement</Label>
                        <Input
                          id="establishment"
                          name="establishment"
                          type="text"
                          placeholder="Nom de l'établissement"
                          value={formData.establishment}
                          onChange={handleInputChange}
                          className="border-gray-200 focus:border-violet focus:ring-violet"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                          <Label htmlFor="region">Région</Label>
                          <Input
                            id="region"
                            name="region"
                            type="text"
                            placeholder="Région"
                            value={formData.region}
                            onChange={handleInputChange}
                            className="border-gray-200 focus:border-violet focus:ring-violet"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="city">Ville</Label>
                          <Input
                            id="city"
                            name="city"
                            type="text"
                            placeholder="Ville"
                            value={formData.city}
                            onChange={handleInputChange}
                            className="border-gray-200 focus:border-violet focus:ring-violet"
                            required
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* Parent Children Codes */}
                  {selectedRole === 'parent' && (
                    <div className="space-y-2">
                      <Label>Codes enfant</Label>
                      {formData.childrenCodes.map((code, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            type="text"
                            placeholder={`Code enfant ${index + 1}`}
                            value={code}
                            onChange={(e) => updateChildCode(index, e.target.value)}
                            className="border-gray-200 focus:border-violet focus:ring-violet"
                          />
                          {formData.childrenCodes.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => removeChildCode(index)}
                              className="shrink-0"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        onClick={addChildCode}
                        className="w-full"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Ajouter un enfant
                      </Button>
                    </div>
                  )}
                </>
              )}

              <Button
                type="submit"
                className="w-full bg-violet hover:bg-violet/90 text-white font-medium py-2.5"
              >
                {isLogin ? 'Se connecter' : 'Créer un compte'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                {isLogin ? "Pas de compte ? " : "Déjà un compte ? "}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-violet hover:text-violet/80 font-medium underline"
                >
                  {isLogin ? "S'inscrire" : 'Se connecter'}
                </button>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Features Preview */}
        <div className="mt-8 grid grid-cols-2 gap-4 text-center">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
            <div className="w-8 h-8 bg-rouge rounded-full mx-auto mb-2"></div>
            <p className="text-white text-sm font-medium">Game Builder</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
            <div className="w-8 h-8 bg-jaune rounded-full mx-auto mb-2"></div>
            <p className="text-white text-sm font-medium">Analytics</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
