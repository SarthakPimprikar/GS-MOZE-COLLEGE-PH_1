"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  Calendar,
  MessageSquare,
  MapPin,
  File,
  FileText as FileTextIcon,
  Eye,
  ChevronLeft,
  XCircle,
  CheckCircle,
  Clock,
  IndianRupee,
  ShieldCheck,
  Tent,
} from "lucide-react";
import { useSession } from "@/context/SessionContext";
import LoadingComponent from "@/components/Loading";
import toast from "react-hot-toast";

const DetailCard = ({ icon, label, value, bgColor, iconColor }) => (
  <div className="flex items-start gap-3">
    <div className={`p-2 rounded-lg ${bgColor} ${iconColor}`}>{icon}</div>
    <div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="font-medium text-gray-900">{value || "N/A"}</p>
    </div>
  </div>
);

const DetailCardDocuments = ({
  icon,
  label,
  value,
  bgColor,
  iconColor,
  fileUrl,
  viewIcon,
}) => (
  <div className="flex items-start gap-3">
    <div className={`p-2 rounded-lg ${bgColor} ${iconColor}`}>{icon}</div>
    <div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <div className="flex items-center gap-2">
        {viewIcon}
        <p className="font-medium text-gray-900">
          {fileUrl ? (
            <a href={fileUrl} target="_blank" rel="noopener noreferrer">
              {value || "N/A"}
            </a>
          ) : (
            value || "N/A"
          )}
        </p>
      </div>
    </div>
  </div>
);

const AdmissionDetailPage = ({ params }) => {
  const { id } = params;
  const router = useRouter();
  const [application, setApplication] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const { user } = useSession();

  React.useEffect(() => {
    const fetchApplication = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/admission/${id}`);
        if (!res.ok) throw new Error("Failed to fetch application");
        const data = await res.json();
        setApplication(data.data);
      } catch (error) {
        setError(error.message);
        toast.error("Failed to load admission details");
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [id]);

  const getStatusConfig = (status) => {
    switch (status) {
      case "approved":
        return {
          color: "bg-green-50 text-green-700 border-green-200",
          icon: CheckCircle,
          label: "Approved",
        };
      case "rejected":
        return {
          color: "bg-red-50 text-red-700 border-red-200",
          icon: XCircle,
          label: "Rejected",
        };
      case "inProcess":
      default:
        return {
          color: "bg-yellow-50 text-yellow-700 border-yellow-200",
          icon: Clock,
          label: "In Process",
        };
    }
  };

  if (loading) return <LoadingComponent />;

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="p-6 text-red-600">Error: {error}</div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="p-6 text-gray-600">Application not found</div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(application.status);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Back button and header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => router.push('/admin/admission-applications')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Back to Applications</span>
          </button>
        </div>

        {/* Main content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {application.fullName || "Admission Details"}
                </h2>
                <p className="text-sm text-gray-600">
                  Application ID: {application._id?.slice(-8) || "N/A"}
                </p>
              </div>
            </div>
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${statusConfig.color}`}
            >
              <statusConfig.icon className="w-4 h-4" />
              <span className="font-medium">{statusConfig.label}</span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Status Banner */}
            <div className="flex items-center justify-between p-4 rounded-xl border mb-6 bg-gray-50">
              <div className="flex items-center gap-3">
                <statusConfig.icon className="w-5 h-5" />
                <div>
                  <p className="font-semibold">
                    Status: {statusConfig.label || "Unknown"}
                  </p>
                  <p className="text-sm opacity-80">
                    Last updated:{" "}
                    {application.updatedAt
                      ? new Date(application.updatedAt).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                Created on:{" "}
                {application.createdAt
                  ? new Date(application.createdAt).toLocaleDateString()
                  : "N/A"}
              </div>
            </div>

            {/* Main Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <DetailCard
                icon={<User className="w-5 h-5" />}
                label="Full Name"
                value={application.fullName}
                bgColor="bg-blue-50"
                iconColor="text-blue-600"
              />

              <DetailCard
                icon={<Mail className="w-5 h-5" />}
                label="Email Address"
                value={application.email}
                bgColor="bg-green-50"
                iconColor="text-green-600"
              />

              <DetailCard
                icon={<Phone className="w-5 h-5" />}
                label="Student WhatsApp"
                value={application.studentWhatsappNumber}
                bgColor="bg-purple-50"
                iconColor="text-purple-600"
              />

              <DetailCard
                icon={<GraduationCap className="w-5 h-5" />}
                label="Branch"
                value={application.branch}
                bgColor="bg-orange-50"
                iconColor="text-orange-600"
              />

              <DetailCard
                icon={<Calendar className="w-5 h-5" />}
                label="Date of Birth"
                value={application.dateOfBirth}
                bgColor="bg-teal-50"
                iconColor="text-teal-600"
              />

              <DetailCard
                icon={<MessageSquare className="w-5 h-5" />}
                label="Gender"
                value={application.gender}
                bgColor="bg-pink-50"
                iconColor="text-pink-600"
              />

              <DetailCard
                icon={<MessageSquare className="w-5 h-5" />}
                label="Mother Name"
                value={application.motherName}
                bgColor="bg-pink-50"
                iconColor="text-pink-600"
              />

              <DetailCard
                icon={<Phone className="w-5 h-5" />}
                label="Parent WhatsApp"
                value={application.fatherGuardianWhatsappNumber}
                bgColor="bg-purple-50"
                iconColor="text-purple-600"
              />

              <DetailCard
                icon={<GraduationCap className="w-5 h-5" />}
                label="Program Type"
                value={application.programType}
                bgColor="bg-orange-50"
                iconColor="text-orange-600"
              />

              <DetailCard
                icon={<GraduationCap className="w-5 h-5" />}
                label="Year"
                value={application.year}
                bgColor="bg-orange-50"
                iconColor="text-orange-600"
              />

              <DetailCard
                icon={<GraduationCap className="w-5 h-5" />}
                label="Admission Round"
                value={application.round}
                bgColor="bg-orange-50"
                iconColor="text-orange-600"
              />

              <DetailCard
                icon={<GraduationCap className="w-5 h-5" />}
                label="Seat Type"
                value={application.seatType}
                bgColor="bg-orange-50"
                iconColor="text-orange-600"
              />

              <DetailCard
                icon={<GraduationCap className="w-5 h-5" />}
                label="Admission Category"
                value={application.admissionCategoryDTE}
                bgColor="bg-orange-50"
                iconColor="text-orange-600"
              />

              <DetailCard
                icon={<MessageSquare className="w-5 h-5" />}
                label="Caste (as per LC)"
                value={application.casteAsPerLC}
                bgColor="bg-pink-50"
                iconColor="text-pink-600"
              />

              <DetailCard
                icon={<MessageSquare className="w-5 h-5" />}
                label="Domicile"
                value={application.domicile}
                bgColor="bg-pink-50"
                iconColor="text-pink-600"
              />

              <DetailCard
                icon={<Tent className="w-5 h-5" />}
                label="Nationality"
                value={application.nationality}
                bgColor="bg-pink-50"
                iconColor="text-pink-600"
              />

              <DetailCard
                icon={<IndianRupee className="w-5 h-5" />}
                label="Family Income"
                value={
                  application.familyIncome
                    ? `₹${application.familyIncome}`
                    : "N/A"
                }
                bgColor="bg-pink-50"
                iconColor="text-pink-600"
              />

              <DetailCard
                icon={<GraduationCap className="w-5 h-5" />}
                label="Admission Year"
                value={application.admissionYear}
                bgColor="bg-pink-50"
                iconColor="text-pink-600"
              />

              <DetailCard
                icon={<ShieldCheck className="w-5 h-5" />}
                label="PRN"
                value={application.prn || "Not Generated"}
                bgColor="bg-pink-50"
                iconColor="text-pink-600"
              />
            </div>

            {/* Address Section */}
            {application.address && application.address.length > 0 && (
              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-indigo-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Address
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {application.address.map((addr, index) => (
                    <React.Fragment key={index}>
                      <DetailCard
                        icon={<MapPin className="w-5 h-5" />}
                        label="Address Line"
                        value={addr.addressLine}
                        bgColor="bg-purple-50"
                        iconColor="text-purple-600"
                      />
                      <DetailCard
                        icon={<MapPin className="w-5 h-5" />}
                        label="City"
                        value={addr.city}
                        bgColor="bg-purple-50"
                        iconColor="text-purple-600"
                      />
                      <DetailCard
                        icon={<MapPin className="w-5 h-5" />}
                        label="State"
                        value={addr.state}
                        bgColor="bg-purple-50"
                        iconColor="text-purple-600"
                      />
                      <DetailCard
                        icon={<MapPin className="w-5 h-5" />}
                        label="Pincode"
                        value={addr.pincode}
                        bgColor="bg-purple-50"
                        iconColor="text-purple-600"
                      />
                      <DetailCard
                        icon={<MapPin className="w-5 h-5" />}
                        label="Country"
                        value={addr.country}
                        bgColor="bg-purple-50"
                        iconColor="text-purple-600"
                      />
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}

            {/* Documents Section */}
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <File className="w-4 h-4 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Documents
                </h3>
              </div>

              {application.documents && application.documents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {application.documents.map((doc, index) => (
                    <DetailCardDocuments
                      key={index}
                      icon={<FileTextIcon className="w-5 h-5" />}
                      label={doc.type || `Document ${index + 1}`}
                      value={doc.fileName}
                      fileUrl={doc.fileUrl}
                      bgColor="bg-purple-50"
                      viewIcon={<Eye className="w-4 h-4" />}
                      iconColor="text-purple-600"
                    />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No documents uploaded</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdmissionDetailPage;