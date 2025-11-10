import React, { useState, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

interface RegisterFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onSuccess,
  onSwitchToLogin,
}) => {
  const { register } = useAuth();
  const formRef = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "",
    location: "",
    licenseNumber: "",
    businessName: "",
    specialty: "",
    customSpecialty: "",
    supplierCategory: "",
    customSupplierCategory: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const healthSpecialties = ["Doctor", "Pharmacist", "Other"];
  const supplierCategories = [
    "Doctor",
    "Wholesaler",
    "Distributor",
    "Pharmacist",
    "Medical Representative",
    "Retailer",
    "Other",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!formData.role) {
      toast.error("Please select a role");
      return;
    }

    setIsLoading(true);

    try {
      const {
        confirmPassword,
        customSpecialty,
        customSupplierCategory,
        ...rest
      } = formData;

      const specializationForHP =
        rest.specialty === "Other" ? customSpecialty : rest.specialty;
      const specializationForSupplier =
        rest.supplierCategory === "Other"
          ? customSupplierCategory
          : rest.supplierCategory;

      const registrationData: any = {
        fullName: rest.fullName,
        email: rest.email,
        phone: rest.phone,
        password: rest.password,
        role: rest.role,
        location: rest.location || undefined,
      };

      if (rest.role === "health_practitioner") {
        registrationData.specialization = specializationForHP || undefined;
        registrationData.licenseNumber = rest.licenseNumber || undefined;
      } else if (rest.role === "supplier") {
        registrationData.businessName = rest.businessName || undefined;
        registrationData.specialization =
          specializationForSupplier || undefined;
      }

      await register(registrationData);
      toast.success("Registration successful. Please wait for admin approval.");
      onSuccess?.();
    } catch (error: any) {
      const response = error?.response;
      if (
        response?.status === 409 &&
        response?.data?.message?.toLowerCase().includes("email")
      ) {
        toast.error("Email already exists.");
      } else if (response?.data?.errors) {
        const errors = response.data.errors;
        if (Array.isArray(errors)) {
          toast.error(errors.map((e: any) => e.message || e).join(""));
        } else if (typeof errors === "object") {
          const allMessages = Object.values(errors as any)
            .flat()
            .join("");
          toast.error(allMessages || "Registration failed.");
        }
      } else if (error?.message) {
        toast.error(error.message);
      } else {
        toast.error("Registration failed due to an unknown error.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      role: value,
      specialty: "",
      customSpecialty: "",
      supplierCategory: "",
      customSupplierCategory: "",
    }));

    setTimeout(() => {
      if (formRef.current) {
        formRef.current.scrollTo({
          top: formRef.current.scrollHeight,
          behavior: "smooth",
        });
      }
    }, 100);
  };

  return (
    <div className="w-full max-w-md mx-auto my-6">
      <Card className="w-full -my-8 max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Join Cross Shield
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-2">
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                required
              />
            </div>

            <div>
              <Label htmlFor="role">Role</Label>
              <Select value={formData.role} onValueChange={handleRoleChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="health_practitioner">
                    Health Practitioner
                  </SelectItem>
                  <SelectItem value="supplier">Supplier</SelectItem>
                  <SelectItem value="diaspora">Diaspora</SelectItem>
                  <SelectItem value="patient">Patient</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.role === "health_practitioner" && (
              <>
                <div>
                  <Label htmlFor="licenseNumber">License Number</Label>
                  <Input
                    id="licenseNumber"
                    name="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={handleChange}
                    placeholder="Enter your license number"
                  />
                </div>

                <div>
                  <Label htmlFor="specialty">Specialty</Label>
                  <Select
                    value={formData.specialty}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        specialty: value,
                        customSpecialty:
                          value === "Other" ? prev.customSpecialty : "",
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select specialty" />
                    </SelectTrigger>
                    <SelectContent>
                      {healthSpecialties.map((spec) => (
                        <SelectItem key={spec} value={spec}>
                          {spec}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {formData.specialty === "Other" && (
                  <div>
                    <Label htmlFor="customSpecialty">Enter Specialty</Label>
                    <Input
                      id="customSpecialty"
                      name="customSpecialty"
                      value={formData.customSpecialty}
                      onChange={handleChange}
                      placeholder="Type your specialty"
                    />
                  </div>
                )}
              </>
            )}

            {formData.role === "supplier" && (
              <>
                <div>
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input
                    id="businessName"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    placeholder="Enter your business name"
                  />
                </div>

                <div>
                  <Label htmlFor="supplierCategory">Supplier Category</Label>
                  <Select
                    value={formData.supplierCategory}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        supplierCategory: value,
                        customSupplierCategory:
                          value === "Other" ? prev.customSupplierCategory : "",
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select supplier category" />
                    </SelectTrigger>
                    <SelectContent>
                      {supplierCategories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {formData.supplierCategory === "Other" && (
                  <div>
                    <Label htmlFor="customSupplierCategory">
                      Enter Supplier Category
                    </Label>
                    <Input
                      id="customSupplierCategory"
                      name="customSupplierCategory"
                      value={formData.customSupplierCategory}
                      onChange={handleChange}
                      placeholder="Type your supplier category"
                    />
                  </div>
                )}
              </>
            )}

            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Enter your location"
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Registering..." : "Register"}
            </Button>

            {onSwitchToLogin && (
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={onSwitchToLogin}
                    className="text-blue-600 hover:underline"
                  >
                    Login here
                  </button>
                </p>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
