"use client";



import React, { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";

import { toast, Toaster } from "react-hot-toast";

import {

    ChevronLeft,

    Save,

    X,

    User,

    GraduationCap,

    MapPin,

    Users as UsersIcon,

    Loader2,

    FileText,

    BookOpen,

    File,

    Eye,

    IndianRupee,

} from "lucide-react";

import LoadingComponent from "@/components/Loading";

import FormField from "@/components/forms/FormField";

import AddressFields from "@/components/forms/AddressFields";



const EditAdmissionPage = ({ params }) => {

    const { id } = React.use(params);

    const router = useRouter();

    const [loading, setLoading] = useState(true);

    const [submitting, setSubmitting] = useState(false);

    const [application, setApplication] = useState(null);

    const [courses, setCourses] = useState([]);

    const [loadingCourses, setLoadingCourses] = useState(true);

    const [feeStructures, setFeeStructures] = useState([]);

    const [currentFeeStructure, setCurrentFeeStructure] = useState(null);



    const {

        control,

        handleSubmit,

        reset,

        watch,

        formState: { errors },

    } = useForm({

        defaultValues: {

            // Personal Details

            firstName: "",

            middleName: "",

            lastName: "",

            fullName: "",

            nameAsPerAadhar: "",

            dateOfBirth: "",

            gender: "",

            email: "",

            studentWhatsappNumber: "",



            // Family Details

            motherName: "",

            fatherGuardianWhatsappNumber: "",

            motherMobileNumber: "",

            familyIncome: "",



            // Academic Details

            admissionYear: "",

            programType: "",

            branch: "",

            year: "",

            round: "",

            seatType: "",

            admissionCategoryDTE: "",

            shift: "",

            admissionType: "",

            dteApplicationNumber: "",

            casteAsPerLC: "",

            feesCategory: "",

            quota: "",

            totalFees: "",



            // Academic Background

            sscBoard: "",

            sscPercentage: "",

            sscYearOfPassing: "",

            hscBoard: "",

            hscPercentage: "",

            hscYearOfPassing: "",

            diplomaBoard: "",

            diplomaPercentage: "",

            diplomaYearOfPassing: "",



            // Additional Details

            nationality: "",

            domicile: "",



            // Address

            address: [

                {

                    addressLine: "",

                    city: "",

                    state: "",

                    pincode: "",

                    country: "",

                },

            ],

        },

    });



    const selectedProgramType = watch("programType");

    const selectedBranch = watch("branch");

    const selectedYear = watch("year");

    const selectedCaste = watch("casteAsPerLC");

    const selectedFeesCategory = watch("feesCategory");



    // Helper to normalize year for comparison

    const normalizeYear = (year) => {

        if (!year) return "";

        const str = year.toString().toLowerCase().trim();

        if (["1", "1st", "first", "fe", "i"].some(s => str.includes(s))) return "1";

        if (["2", "2nd", "second", "se", "ii"].some(s => str.includes(s))) return "2";

        if (["3", "3rd", "third", "te", "iii"].some(s => str.includes(s))) return "3";

        if (["4", "4th", "fourth", "be", "iv"].some(s => str.includes(s))) return "4";

        return str;

    };



    // Update feesCategory options based on matching fee structures

    useEffect(() => {

        if (

            selectedProgramType &&

            selectedBranch &&

            selectedYear &&

            selectedCaste &&

            feeStructures.length > 0

        ) {

            const matchingFeeStructures = feeStructures.filter(

                (fee) => {

                    const matchProgram = fee.programType?.trim().toLowerCase() === selectedProgramType?.trim().toLowerCase();

                    const matchBranch = fee.departmentName?.trim().toLowerCase() === selectedBranch?.trim().toLowerCase();

                    const feeYear = normalizeYear(fee.year);

                    const selYear = normalizeYear(selectedYear);

                    const matchYear = feeYear === selYear;

                    

                    const feeCaste = fee.caste?.trim().toLowerCase() || "";

                    const selCaste = selectedCaste?.trim().toLowerCase() || "";

                    const matchCaste = feeCaste === selCaste || (feeCaste && selCaste && (feeCaste.includes(selCaste) || selCaste.includes(feeCaste)));

                    

                    // Match on all 5 factors: year, program type, branch, caste

                    return matchProgram && matchBranch && matchYear && matchCaste;

                }

            );

            

            if (matchingFeeStructures.length === 0) {

                return;

            }

        }

    }, [selectedProgramType, selectedBranch, selectedYear, feeStructures]);



    // Update current fee structure object for display when category changes

    useEffect(() => {

        if (

            selectedProgramType &&

            selectedBranch &&

            selectedYear &&

            selectedFeesCategory &&

            feeStructures.length > 0

        ) {

            const found = feeStructures.find(

                (fee) => {

                    const matchProgram = fee.programType?.trim().toLowerCase() === selectedProgramType?.trim().toLowerCase();

                    const matchBranch = fee.departmentName?.trim().toLowerCase() === selectedBranch?.trim().toLowerCase();

                    const matchYear = normalizeYear(fee.year) === normalizeYear(selectedYear);

                    const matchCategory = fee.scholarshipParticular === selectedFeesCategory;

                    

                    // Only match on 3 factors: year, program type, and branch, plus category

                    return matchProgram && matchBranch && matchYear && matchCategory;

                }

            );

            setCurrentFeeStructure(found || null);

            

            // Auto-calculate and set totalFees

            if (found) {

                const studentTotal = found.feesFromStudent?.reduce((sum, item) => sum + (item.amount || 0), 0) || 0;

                const welfareTotal = found.feesFromSocialWelfare?.reduce((sum, item) => sum + (item.amount || 0), 0) || 0;

                const total = studentTotal + welfareTotal;

                // Update form value

                const currentValues = watch();

                if (currentValues.totalFees !== total) {

                    reset({ ...currentValues, totalFees: total });

                }

            }

        } else {

            setCurrentFeeStructure(null);

        }

    }, [selectedProgramType, selectedBranch, selectedYear, selectedFeesCategory, feeStructures, reset, watch]);



    // Helper to get fee category options

    const getFeeCategoryOptions = () => {

        const matches = feeStructures.filter(

            (fee) => {

                const matchProgram = fee.programType?.trim().toLowerCase() === selectedProgramType?.trim().toLowerCase();

                const matchBranch = fee.departmentName?.trim().toLowerCase() === selectedBranch?.trim().toLowerCase();

                

                const feeYear = normalizeYear(fee.year);

                const selYear = normalizeYear(selectedYear);

                const matchYear = feeYear === selYear; 

                

                // Match on all 5 factors: year, program type, branch, caste

                const feeCaste = fee.caste?.trim().toLowerCase() || "";

                const selCaste = selectedCaste?.trim().toLowerCase() || "";

                const matchCaste = feeCaste === selCaste || (feeCaste && selCaste && (feeCaste.includes(selCaste) || selCaste.includes(feeCaste)));

                

                return matchProgram && matchBranch && matchYear && matchCaste;

            }

        );

        

        const uniqueCategories = [

            ...new Set(

                matches

                    .map((fee) => fee.scholarshipParticular)

            ),

        ];



        if (uniqueCategories.length === 0) {

            return [{ value: "", label: "No Fee Structure Found" }];

        }

        

        return [

            { value: "", label: "Select Fees Category" },

            ...uniqueCategories.map((sp) => ({

                value: sp,

                label: (!sp || sp === "none") ? "Active Fee Structure" : sp.charAt(0).toUpperCase() + sp.slice(1),

            })),

        ];

    };



    const feesCategoryOptions = getFeeCategoryOptions();



    // Fetch courses

    useEffect(() => {

        const fetchCourses = async () => {

            try {

                setLoadingCourses(true);

                const res = await fetch("/api/courses");

                if (res.ok) {

                    const data = await res.json();

                    setCourses(data.courses || []);

                }

            } catch (error) {

                console.error("Error fetching courses:", error);

            } finally {

                setLoadingCourses(false);

            }

        };

        fetchCourses();

    }, []);



    // Fetch fee structures

    useEffect(() => {

        const fetchFeeStructures = async () => {

            try {

                const res = await fetch("/api/fee/feestructure");

                if (res.ok) {

                    const data = await res.json();

                    setFeeStructures(data.feeStructures || []);

                }

            } catch (error) {

                console.error("Error fetching fee structures:", error);

            }

        };

        fetchFeeStructures();

    }, []);



    // Fetch application data

    useEffect(() => {

        const fetchApplication = async () => {

            try {

                setLoading(true);

                const res = await fetch(`/api/admission/${id}`);

                if (!res.ok) throw new Error("Failed to fetch application");

                const data = await res.json();



                if (data.success && data.data) {

                    setApplication(data.data);



                    // Pre-fill form with existing data

                    reset({

                        // Personal Details

                        firstName: data.data.firstName || "",

                        middleName: data.data.middleName || "",

                        lastName: data.data.lastName || "",

                        fullName: data.data.fullName || "",

                        nameAsPerAadhar: data.data.nameAsPerAadhar || "",

                        dateOfBirth: data.data.dateOfBirth

                            ? new Date(data.data.dateOfBirth).toISOString().split("T")[0]

                            : "",

                        gender: data.data.gender || "",

                        email: data.data.email || "",

                        studentWhatsappNumber: data.data.studentWhatsappNumber || "",



                        // Family Details

                        motherName: data.data.motherName || "",

                        fatherGuardianWhatsappNumber: data.data.fatherGuardianWhatsappNumber || "",

                        motherMobileNumber: data.data.motherMobileNumber || "",

                        familyIncome: data.data.familyIncome || "",



                        // Academic Details

                        admissionYear: data.data.admissionYear || "",

                        programType: data.data.programType || "",

                        branch: data.data.branch || "",

                        year: data.data.year || "",

                        round: data.data.round || "",

                        seatType: data.data.seatType || "",

                        admissionCategoryDTE: data.data.admissionCategoryDTE || "",

                        shift: data.data.shift || "",

                        admissionType: data.data.admissionType || "",

                        dteApplicationNumber: data.data.dteApplicationNumber || "",

                        casteAsPerLC: data.data.casteAsPerLC || "",

                        feesCategory: data.data.feesCategory || "",

                        quota: data.data.quota || "",

                        totalFees: data.data.totalFees || "",



                        // Academic Background

                        sscBoard: data.data.sscBoard || "",

                        sscPercentage: data.data.sscPercentage || "",

                        sscYearOfPassing: data.data.sscYearOfPassing || "",

                        hscBoard: data.data.hscBoard || "",

                        hscPercentage: data.data.hscPercentage || "",

                        hscYearOfPassing: data.data.hscYearOfPassing || "",

                        diplomaBoard: data.data.diplomaBoard || "",

                        diplomaPercentage: data.data.diplomaPercentage || "",

                        diplomaYearOfPassing: data.data.diplomaYearOfPassing || "",



                        // Additional Details

                        nationality: data.data.nationality || "",

                        domicile: data.data.domicile || "",



                        // Address

                        address: data.data.address && data.data.address.length > 0

                            ? data.data.address

                            : [

                                {

                                    addressLine: "",

                                    city: "",

                                    state: "",

                                    pincode: "",

                                    country: "",

                                },

                            ],

                    });

                }

            } catch (error) {

                console.error("Error fetching application:", error);

                toast.error("Failed to load application data");

            } finally {

                setLoading(false);

            }

        };



        fetchApplication();

    }, [id, reset]);



    const onSubmit = async (formData) => {

        try {

            setSubmitting(true);



            const res = await fetch(`/api/admission/${id}`, {

                method: "PUT",

                headers: {

                    "Content-Type": "application/json",

                },

                body: JSON.stringify(formData),

            });



            const data = await res.json();



            if (data.success) {

                toast.success("Application updated successfully!");

                setTimeout(() => {

                    router.push("/admin/admission-applications");

                }, 1500);

            } else {

                toast.error(data.message || "Failed to update application");

            }

        } catch (error) {

            console.error("Error updating application:", error);

            toast.error("An error occurred while updating");

        } finally {

            setSubmitting(false);

        }

    };



    // Program type options

    const programTypeOptions = [

        { value: "", label: "Select Program Type" },

        ...Array.from(new Set(courses?.map((course) => course.programType) || [])).map(

            (type) => ({

                value: type,

                label: type,

            })

        ),

    ];



    // Branch options based on selected program type

    const filteredCourses = selectedProgramType

        ? courses.filter((course) => course.programType === selectedProgramType)

        : [];

    const branchOptions = [

        {

            value: "",

            label: selectedProgramType ? "Select Branch" : "First select Program Type",

        },

        ...filteredCourses.map((course) => ({

            value: course.name,

            label: course.name,

        })),

    ];



    if (loading) return <LoadingComponent />;



    if (!application) {

        return (

            <div className="min-h-screen bg-gray-50 flex items-center justify-center">

                <div className="p-6 text-gray-600">Application not found</div>

            </div>

        );

    }



    return (

        <div className="min-h-screen bg-gray-50 p-6">

            <Toaster />

            <div className="max-w-6xl mx-auto">

                {/* Header */}

                <div className="flex items-center justify-between mb-6">

                    <div className="flex items-center gap-4">

                        <button

                            onClick={() => router.push("/admin/admission-applications")}

                            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"

                        >

                            <ChevronLeft className="w-5 h-5" />

                            <span>Back to Applications</span>

                        </button>

                    </div>

                </div>



                {/* Form Card */}

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

                    {/* Header */}

                    <div className="p-6 border-b border-gray-100 bg-gradient-to-br from-blue-50 to-purple-50">

                        <div className="flex items-center gap-3">

                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">

                                <User className="w-6 h-6 text-white" />

                            </div>

                            <div>

                                <h1 className="text-2xl font-bold text-gray-900">

                                    Edit Admission Application

                                </h1>

                                <p className="text-sm text-gray-600">

                                    Update all application details for {application.fullName}

                                </p>

                            </div>

                        </div>

                    </div>



                    {/* Form */}

                    <form onSubmit={handleSubmit(onSubmit)} className="p-6">

                        {/* Personal Details Section */}

                        <div className="mb-8">

                            <div className="flex items-center gap-2 mb-4">

                                <User className="w-5 h-5 text-blue-600" />

                                <h2 className="text-lg font-semibold text-gray-900">

                                    Personal Details

                                </h2>

                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                <FormField

                                    control={control}

                                    name="firstName"

                                    label="First Name"

                                    type="text"

                                    placeholder="Enter first name"

                                    error={errors?.firstName}

                                    required

                                    alphaOnly={true}

                                    minLength={2}

                                    maxLength={20}

                                />

                                <FormField

                                    control={control}

                                    name="middleName"

                                    label="Middle Name"

                                    type="text"

                                    placeholder="Enter middle name"

                                    error={errors?.middleName}

                                    alphaOnly={true}

                                    maxLength={20}

                                />

                                <FormField

                                    control={control}

                                    name="lastName"

                                    label="Last Name"

                                    type="text"

                                    placeholder="Enter last name"

                                    error={errors?.lastName}

                                    required

                                    alphaOnly={true}

                                    minLength={3}

                                    maxLength={20}

                                />

                                <FormField

                                    control={control}

                                    name="fullName"

                                    label="Full Name (as per mark sheet)"

                                    type="text"

                                    placeholder="Enter full name"

                                    error={errors?.fullName}

                                    required

                                    alphaOnly={true}

                                    minLength={3}

                                    maxLength={60}

                                />

                                <FormField

                                    control={control}

                                    name="nameAsPerAadhar"

                                    label="Name as per Aadhar"

                                    type="text"

                                    placeholder="Enter name as per Aadhar"

                                    error={errors?.nameAsPerAadhar}

                                    required

                                    alphaOnly={true}

                                    minLength={3}

                                    maxLength={60}

                                />

                                <FormField

                                    control={control}

                                    name="dateOfBirth"

                                    label="Date of Birth"

                                    type="date"

                                    error={errors?.dateOfBirth}

                                    required

                                    maxDate={new Date().toISOString().split("T")[0]}

                                />

                                <FormField

                                    control={control}

                                    name="gender"

                                    label="Gender"

                                    type="select"

                                    options={[

                                        { value: "", label: "Select Gender" },

                                        { value: "Male", label: "Male" },

                                        { value: "Female", label: "Female" },

                                        { value: "Other", label: "Other" },

                                    ]}

                                    error={errors?.gender}

                                    required

                                />

                                <FormField

                                    control={control}

                                    name="email"

                                    label="Email"

                                    type="email"

                                    placeholder="Enter email"

                                    error={errors?.email}

                                    required

                                />

                                <FormField

                                    control={control}

                                    name="studentWhatsappNumber"

                                    label="Student WhatsApp Number"

                                    type="tel"

                                    placeholder="10-digit mobile number"

                                    error={errors?.studentWhatsappNumber}

                                    required

                                    numericOnly={true}

                                    minLength={10}

                                    maxLength={10}

                                />

                            </div>

                        </div>



                        {/* Family Details Section */}

                        <div className="mb-8">

                            <div className="flex items-center gap-2 mb-4">

                                <UsersIcon className="w-5 h-5 text-purple-600" />

                                <h2 className="text-lg font-semibold text-gray-900">

                                    Family Details

                                </h2>

                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                <FormField

                                    control={control}

                                    name="motherName"

                                    label="Mother's Name"

                                    type="text"

                                    placeholder="Enter mother's name"

                                    error={errors?.motherName}

                                    alphaOnly={true}

                                    maxLength={20}

                                />

                                <FormField

                                    control={control}

                                    name="fatherGuardianWhatsappNumber"

                                    label="Father/Guardian WhatsApp"

                                    type="tel"

                                    placeholder="10-digit mobile number"

                                    error={errors?.fatherGuardianWhatsappNumber}

                                    numericOnly={true}

                                    minLength={10}

                                    maxLength={10}

                                />

                                <FormField

                                    control={control}

                                    name="motherMobileNumber"

                                    label="Mother's Mobile Number"

                                    type="tel"

                                    placeholder="10-digit mobile number"

                                    error={errors?.motherMobileNumber}

                                    numericOnly={true}

                                    minLength={10}

                                    maxLength={10}

                                />

                                <FormField

                                    control={control}

                                    name="familyIncome"

                                    label="Annual Family Income (₹)"

                                    type="number"

                                    placeholder="Enter family income"

                                    error={errors?.familyIncome}

                                    numericOnly={true}

                                    min={0}

                                />

                            </div>

                        </div>



                        {/* Academic Background Section */}

                        <div className="mb-8">

                            <div className="flex items-center gap-2 mb-4">

                                <BookOpen className="w-5 h-5 text-indigo-600" />

                                <h2 className="text-lg font-semibold text-gray-900">

                                    Academic Background

                                </h2>

                            </div>



                            {/* SSC Details */}

                            <div className="mb-4">

                                <h3 className="text-sm font-semibold text-gray-700 mb-3">

                                    SSC (10th) Details

                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                                    <FormField

                                        control={control}

                                        name="sscBoard"

                                        label="Board"

                                        type="text"

                                        placeholder="e.g., Maharashtra State Board"

                                        error={errors?.sscBoard}

                                    />

                                    <FormField

                                        control={control}

                                        name="sscPercentage"

                                        label="Percentage"

                                        type="number"

                                        placeholder="Enter percentage"

                                        error={errors?.sscPercentage}

                                        min={0}

                                        max={100}

                                    />

                                    <FormField

                                        control={control}

                                        name="sscYearOfPassing"

                                        label="Year of Passing"

                                        type="number"

                                        placeholder="e.g., 2020"

                                        error={errors?.sscYearOfPassing}

                                        min={1950}

                                        max={new Date().getFullYear()}

                                    />

                                </div>

                            </div>



                            {/* HSC/Diploma Details */}

                            <div className="mb-4">

                                <h3 className="text-sm font-semibold text-gray-700 mb-3">

                                    HSC (12th) Details

                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                                    <FormField

                                        control={control}

                                        name="hscBoard"

                                        label="Board"

                                        type="text"

                                        placeholder="e.g., Maharashtra State Board"

                                        error={errors?.hscBoard}

                                    />

                                    <FormField

                                        control={control}

                                        name="hscPercentage"

                                        label="Percentage"

                                        type="number"

                                        placeholder="Enter percentage"

                                        error={errors?.hscPercentage}

                                        min={0}

                                        max={100}

                                    />

                                    <FormField

                                        control={control}

                                        name="hscYearOfPassing"

                                        label="Year of Passing"

                                        type="number"

                                        placeholder="e.g., 2022"

                                        error={errors?.hscYearOfPassing}

                                        min={1950}

                                        max={new Date().getFullYear()}

                                    />

                                </div>

                            </div>



                            {/* Diploma Details (Optional) */}

                            <div>

                                <h3 className="text-sm font-semibold text-gray-700 mb-3">

                                    Diploma Details (if applicable)

                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                                    <FormField

                                        control={control}

                                        name="diplomaBoard"

                                        label="Board/University"

                                        type="text"

                                        placeholder="e.g., MSBTE"

                                        error={errors?.diplomaBoard}

                                    />

                                    <FormField

                                        control={control}

                                        name="diplomaPercentage"

                                        label="Percentage"

                                        type="number"

                                        placeholder="Enter percentage"

                                        error={errors?.diplomaPercentage}

                                        min={0}

                                        max={100}

                                    />

                                    <FormField

                                        control={control}

                                        name="diplomaYearOfPassing"

                                        label="Year of Passing"

                                        type="number"

                                        placeholder="e.g., 2023"

                                        error={errors?.diplomaYearOfPassing}

                                        min={1950}

                                        max={new Date().getFullYear()}

                                    />

                                </div>

                            </div>

                        </div>



                        {/* Academic Details Section */}

                        <div className="mb-8">

                            <div className="flex items-center gap-2 mb-4">

                                <GraduationCap className="w-5 h-5 text-green-600" />

                                <h2 className="text-lg font-semibold text-gray-900">

                                    Current Admission Details

                                </h2>

                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                                <FormField

                                    control={control}

                                    name="admissionYear"

                                    label="Admission Year"

                                    type="text"

                                    placeholder="e.g., 2024-25"

                                    error={errors?.admissionYear}

                                    required

                                />

                                <FormField

                                    control={control}

                                    name="programType"

                                    label="Program Type"

                                    type="select"

                                    options={programTypeOptions}

                                    error={errors?.programType}

                                    required

                                    disabled={loadingCourses}

                                />

                                <FormField

                                    control={control}

                                    name="branch"

                                    label="Branch/Course"

                                    type="select"

                                    options={branchOptions}

                                    error={errors?.branch}

                                    required

                                    disabled={!selectedProgramType || loadingCourses}

                                />

                                <FormField

                                    control={control}

                                    name="year"

                                    label="Year"

                                    type="select"

                                    options={[

                                        { value: "", label: "Select Year" },

                                        { value: "1st", label: "1st Year" },

                                        { value: "2nd", label: "2nd Year" },

                                        { value: "3rd", label: "3rd Year" },

                                        { value: "4th", label: "4th Year" },

                                    ]}

                                    error={errors?.year}

                                    required

                                />

                                <FormField

                                    control={control}

                                    name="round"

                                    label="Admission Round"

                                    type="select"

                                    options={[

                                        { value: "", label: "Select Round" },

                                        { value: "CAP1", label: "CAP Round 1" },

                                        { value: "CAP2", label: "CAP Round 2" },

                                        { value: "CAP3", label: "CAP Round 3" },

                                        { value: "Institute Level", label: "Institute Level" },

                                    ]}

                                    error={errors?.round}

                                    required

                                />

                                <FormField

                                    control={control}

                                    name="seatType"

                                    label="Seat Type"

                                    type="select"

                                    options={[

                                        { value: "", label: "Select Seat Type" },

                                        { value: "Government", label: "Government" },

                                        { value: "Minority", label: "Minority" },

                                        { value: "Management", label: "Management" },

                                        { value: "TFWS", label: "TFWS" },

                                    ]}

                                    error={errors?.seatType}

                                    required

                                />

                                <FormField

                                    control={control}

                                    name="admissionCategoryDTE"

                                    label="Admission Category (DTE)"

                                    type="select"

                                    options={[

                                        { value: "", label: "Select Category" },

                                        { value: "CAP", label: "CAP" },

                                        { value: "Institute Level", label: "Institute Level" },

                                        { value: "Against CAP", label: "Against CAP" },

                                    ]}

                                    error={errors?.admissionCategoryDTE}

                                    required

                                />

                                <FormField

                                    control={control}

                                    name="shift"

                                    label="Shift"

                                    type="select"

                                    options={[

                                        { value: "", label: "Select Shift" },

                                        { value: "Morning", label: "Morning" },

                                        { value: "Afternoon", label: "Afternoon" },

                                        { value: "Evening", label: "Evening" },

                                    ]}

                                    error={errors?.shift}

                                />

                                <FormField

                                    control={control}

                                    name="admissionType"

                                    label="Admission Type"

                                    type="text"

                                    placeholder="Enter admission type"

                                    error={errors?.admissionType}

                                    alphaOnly={true}

                                    maxLength={20}

                                />

                                <FormField

                                    control={control}

                                    name="dteApplicationNumber"

                                    label="DTE Application Number"

                                    type="text"

                                    placeholder="Enter DTE application number"

                                    error={errors?.dteApplicationNumber}

                                    maxLength={20}

                                />

                                <FormField

                                    control={control}

                                    name="casteAsPerLC"

                                    label="Caste as per LC"

                                    type="select"

                                    options={[

                                        { value: "", label: "Select Caste" },

                                        { value: "General", label: "General" },

                                        { value: "OBC", label: "OBC" },

                                        { value: "SC", label: "SC" },

                                        { value: "ST", label: "ST" },

                                        { value: "NT", label: "NT" },

                                    ]}

                                    error={errors?.casteAsPerLC}

                                    required

                                />

                                <FormField

                                    control={control}

                                    name="feesCategory"

                                    label="Fees Category"

                                    type="select"

                                    options={feesCategoryOptions}

                                    error={errors?.feesCategory}

                                    disabled={

                                        !selectedProgramType ||

                                        !selectedBranch ||

                                        !selectedYear ||

                                        feesCategoryOptions.length <= 1

                                    }

                                />

                                <FormField

                                    control={control}

                                    name="totalFees"

                                    label="Total Fees (₹)"

                                    type="number"

                                    error={errors?.totalFees}

                                    disabled={true} // Read-only

                                    required

                                />

                                <FormField

                                    control={control}

                                    name="quota"

                                    label="Quota"

                                    type="text"

                                    placeholder="Enter quota"

                                    error={errors?.quota}

                                    alphaOnly={true}

                                    maxLength={20}

                                />

                            </div>

                        </div>



                        {/* Fee Structure Display */}

                        {currentFeeStructure && (

                            <div className="mb-8 border rounded-xl overflow-hidden shadow-sm bg-gray-50 p-6">

                                <div className="flex items-center gap-3 mb-4">

                                    <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">

                                        <FileText className="w-4 h-4 text-indigo-600" />

                                    </div>

                                    <div>

                                        <h3 className="text-lg font-semibold text-gray-900">

                                            Fee Structure Details

                                        </h3>

                                        <p className="text-xs text-gray-500 mt-1">

                                            Based on selection: {currentFeeStructure.programType} - {currentFeeStructure.departmentName} - {currentFeeStructure.year} - {currentFeeStructure.caste} - {currentFeeStructure.category}

                                        </p>

                                    </div>

                                </div>



                                <div className="p-4 bg-white rounded-lg border">

                                    {/* Student Fees */}

                                    {currentFeeStructure.feesFromStudent?.length > 0 && (

                                        <div className="mb-4">

                                            <h5 className="text-sm font-semibold text-gray-600 mb-2">

                                                Fees from Student

                                            </h5>

                                            <div className="overflow-x-auto">

                                                <table className="min-w-full text-sm">

                                                    <thead className="bg-gray-50">

                                                        <tr>

                                                            <th className="px-4 py-2 text-left text-gray-600">

                                                                Component

                                                            </th>

                                                            <th className="px-4 py-2 text-right text-gray-600">

                                                                Amount (₹)

                                                            </th>

                                                        </tr>

                                                    </thead>

                                                    <tbody className="divide-y">

                                                        {currentFeeStructure.feesFromStudent.map(

                                                            (item, idx) => (

                                                                <tr key={`student-${idx}`}>

                                                                    <td className="px-4 py-2">

                                                                        {item.componentName}

                                                                    </td>

                                                                    <td className="px-4 py-2 text-right">

                                                                        {item.amount}

                                                                    </td>

                                                                </tr>

                                                            )

                                                        )}

                                                    </tbody>

                                                </table>

                                            </div>

                                        </div>

                                    )}



                                    {/* Social Welfare Fees */}

                                    {currentFeeStructure.feesFromSocialWelfare?.length > 0 && (

                                        <div className="mb-4">

                                            <h5 className="text-sm font-semibold text-gray-600 mb-2">

                                                Fees from Social Welfare

                                            </h5>

                                            <div className="overflow-x-auto">

                                                <table className="min-w-full text-sm">

                                                    <thead className="bg-gray-50">

                                                        <tr>

                                                            <th className="px-4 py-2 text-left text-gray-600">

                                                                Component

                                                            </th>

                                                            <th className="px-4 py-2 text-right text-gray-600">

                                                                Amount (₹)

                                                            </th>

                                                        </tr>

                                                    </thead>

                                                    <tbody className="divide-y">

                                                        {currentFeeStructure.feesFromSocialWelfare.map(

                                                            (item, idx) => (

                                                                <tr key={`welfare-${idx}`}>

                                                                    <td className="px-4 py-2">

                                                                        {item.componentName}

                                                                    </td>

                                                                    <td className="px-4 py-2 text-right">

                                                                        {item.amount}

                                                                    </td>

                                                                </tr>

                                                            )

                                                        )}

                                                    </tbody>

                                                </table>

                                            </div>

                                        </div>

                                    )}



                                    <div className="flex justify-end pt-4 border-t mt-2">

                                        <p className="text-lg font-bold text-gray-900">

                                            Total Fee: ₹{currentFeeStructure.feesFromStudent?.reduce((sum, item) => sum + (item.amount || 0), 0) + (currentFeeStructure.feesFromSocialWelfare?.reduce((sum, item) => sum + (item.amount || 0), 0) || 0)}

                                        </p>

                                    </div>

                                </div>

                            </div>

                        )}



                        {/* Additional Details Section */}

                        <div className="mb-8">

                            <div className="flex items-center gap-2 mb-4">

                                <FileText className="w-5 h-5 text-pink-600" />

                                <h2 className="text-lg font-semibold text-gray-900">

                                    Additional Details

                                </h2>

                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                <FormField

                                    control={control}

                                    name="nationality"

                                    label="Nationality"

                                    type="text"

                                    placeholder="Enter nationality"

                                    error={errors?.nationality}

                                    alphaOnly={true}

                                />

                                <FormField

                                    control={control}

                                    name="domicile"

                                    label="Domicile"

                                    type="text"

                                    placeholder="Enter domicile"

                                    error={errors?.domicile}

                                    alphaOnly={true}

                                />

                            </div>

                        </div>



                        {/* Documents Section (View Only) */}

                        {application.documents && application.documents.length > 0 && (

                            <div className="mb-8">

                                <div className="flex items-center gap-2 mb-4">

                                    <File className="w-5 h-5 text-amber-600" />

                                    <h2 className="text-lg font-semibold text-gray-900">

                                        Uploaded Documents

                                    </h2>

                                    <span className="text-xs text-gray-500 ml-2">(View only - cannot edit documents here)</span>

                                </div>

                                <div className="bg-gray-50 rounded-lg p-4">

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                        {application.documents.map((doc, index) => (

                                            <div

                                                key={index}

                                                className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200"

                                            >

                                                <div className="flex items-center gap-3">

                                                    <File className="w-5 h-5 text-gray-400" />

                                                    <div>

                                                        <p className="text-sm font-medium text-gray-900">

                                                            {doc.type || `Document ${index + 1}`}

                                                        </p>

                                                        <p className="text-xs text-gray-500">

                                                            {doc.fileName || "No filename"}

                                                        </p>

                                                    </div>

                                                </div>

                                                {doc.fileUrl && (

                                                    <a

                                                        href={doc.fileUrl}

                                                        target="_blank"

                                                        rel="noopener noreferrer"

                                                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"

                                                    >

                                                        <Eye className="w-4 h-4" />

                                                        View

                                                    </a>

                                                )}

                                            </div>

                                        ))}

                                    </div>

                                </div>

                            </div>

                        )}



                        {/* Address Section */}

                        <div className="mb-8">

                            <div className="flex items-center gap-2 mb-4">

                                <MapPin className="w-5 h-5 text-orange-600" />

                                <h2 className="text-lg font-semibold text-gray-900">

                                    Address

                                </h2>

                            </div>

                            <AddressFields control={control} errors={errors} index={0} />

                        </div>



                        {/* Action Buttons */}

                        <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">

                            <button

                                type="button"

                                onClick={() => router.push("/admin/admission-applications")}

                                className="flex items-center gap-2 px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"

                            >

                                <X className="w-4 h-4" />

                                Cancel

                            </button>

                            <button

                                type="submit"

                                disabled={submitting}

                                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"

                            >

                                {submitting ? (

                                    <>

                                        <Loader2 className="w-4 h-4 animate-spin" />

                                        Saving...

                                    </>

                                ) : (

                                    <>

                                        <Save className="w-4 h-4" />

                                        Save Changes

                                    </>

                                )}

                            </button>

                        </div>

                    </form>

                </div>

            </div>

        </div>

    );

};



export default EditAdmissionPage;

