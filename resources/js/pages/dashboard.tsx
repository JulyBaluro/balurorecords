import { Head } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import { addDoc, collection, deleteDoc, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { db } from '@/lib/firebase';
import { dashboard } from '@/routes';

type Student = {
    id: string;
    studentId: string;
    name: string;
    course: string;
    year: string;
    email: string;
};

const emptyForm = {
    studentId: '',
    name: '',
    course: '',
    year: '',
    email: '',
};

const studentsCollection = collection(db, 'students');

export default function Dashboard() {
    const [students, setStudents] = useState<Student[]>([]);
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = onSnapshot(studentsCollection, (snapshot) => {
            const studentList = snapshot.docs.map((document) => {
                const data = document.data() as Partial<Student>;

                return {
                    id: document.id,
                    studentId: data.studentId ?? '',
                    name: data.name ?? '',
                    course: data.course ?? '',
                    year: data.year ?? '',
                    email: data.email ?? '',
                };
            });

            setStudents(studentList);
        });

        return () => unsubscribe();
    }, []);

    const totalStudents = useMemo(() => students.length, [students]);

    const handleChange = (field: keyof typeof emptyForm, value: string) => {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));
    };

    const resetForm = () => {
        setForm(emptyForm);
        setEditingId(null);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!form.studentId || !form.name || !form.course || !form.year || !form.email) {
            return;
        }

        try {
            if (editingId) {
                const studentRef = doc(db, 'students', editingId);
                await updateDoc(studentRef, form);
            } else {
                await addDoc(collection(db, 'students'), form);
            }
        } catch (error) {
            console.error('Error saving student:', error);
        }

        resetForm();
    };

    const handleEdit = (student: Student) => {
        setEditingId(student.id);
        setForm({
            studentId: student.studentId,
            name: student.name,
            course: student.course,
            year: student.year,
            email: student.email,
        });
    };

    const handleDelete = async (id: string) => {
        try {
            const studentRef = doc(db, 'students', id);
            await deleteDoc(studentRef);
        } catch (error) {
            console.error('Error deleting student:', error);
        }

        if (editingId === id) {
            resetForm();
        }
    };

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-xl border bg-card p-4 shadow-sm">
                        <p className="text-sm text-muted-foreground">Total Students</p>
                        <h2 className="mt-2 text-3xl font-bold">{totalStudents}</h2>
                    </div>
                    <div className="rounded-xl border bg-card p-4 shadow-sm">
                        <p className="text-sm text-muted-foreground">Active Records</p>
                        <h2 className="mt-2 text-3xl font-bold">{students.filter((student) => student.name).length}</h2>
                    </div>
                    <div className="rounded-xl border bg-card p-4 shadow-sm">
                        <p className="text-sm text-muted-foreground">Status</p>
                        <h2 className="mt-2 text-3xl font-bold text-emerald-600">Online</h2>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>{editingId !== null ? 'Edit Student Information' : 'Add Student Information'}</CardTitle>
                        <CardDescription>
                            {editingId !== null
                                ? 'Update the selected student details below.'
                                : 'Fill in the student details to add them to the list.'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="overflow-x-auto rounded-lg border">
                                <table className="min-w-full text-left text-sm">
                                    <thead className="bg-muted/50">
                                        <tr>
                                            <th className="px-3 py-2 font-medium">Student ID</th>
                                            <th className="px-3 py-2 font-medium">Name</th>
                                            <th className="px-3 py-2 font-medium">Course</th>
                                            <th className="px-3 py-2 font-medium">Year</th>
                                            <th className="px-3 py-2 font-medium">Email</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="border-t px-3 py-3">
                                                <Input
                                                    value={form.studentId}
                                                    onChange={(event) => handleChange('studentId', event.target.value)}
                                                    placeholder="STU-2026-001"
                                                />
                                            </td>
                                            <td className="border-t px-3 py-3">
                                                <Input
                                                    value={form.name}
                                                    onChange={(event) => handleChange('name', event.target.value)}
                                                    placeholder="Student name"
                                                />
                                            </td>
                                            <td className="border-t px-3 py-3">
                                                <Input
                                                    value={form.course}
                                                    onChange={(event) => handleChange('course', event.target.value)}
                                                    placeholder="Course"
                                                />
                                            </td>
                                            <td className="border-t px-3 py-3">
                                                <Input
                                                    value={form.year}
                                                    onChange={(event) => handleChange('year', event.target.value)}
                                                    placeholder="Year level"
                                                />
                                            </td>
                                            <td className="border-t px-3 py-3">
                                                <Input
                                                    value={form.email}
                                                    onChange={(event) => handleChange('email', event.target.value)}
                                                    placeholder="student@email.com"
                                                    type="email"
                                                />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div className="flex items-center gap-3">
                                <Button type="submit">{editingId !== null ? 'Update Student' : 'Add Student'}</Button>
                                {editingId !== null && (
                                    <Button type="button" variant="outline" onClick={resetForm}>
                                        Cancel
                                    </Button>
                                )}
                            </div>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Student Records</CardTitle>
                        <CardDescription>List of all students in your dashboard.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto rounded-lg border">
                            <table className="min-w-full text-left text-sm">
                                <thead className="bg-muted/50">
                                    <tr>
                                        <th className="px-3 py-2 font-medium">Student ID</th>
                                        <th className="px-3 py-2 font-medium">Name</th>
                                        <th className="px-3 py-2 font-medium">Course</th>
                                        <th className="px-3 py-2 font-medium">Year</th>
                                        <th className="px-3 py-2 font-medium">Email</th>
                                        <th className="px-3 py-2 font-medium text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {students.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-3 py-8 text-center text-muted-foreground">
                                                No students added yet.
                                            </td>
                                        </tr>
                                    ) : (
                                        students.map((student) => (
                                            <tr key={student.id} className="align-top">
                                                <td className="border-t px-3 py-3">{student.studentId}</td>
                                                <td className="border-t px-3 py-3">{student.name}</td>
                                                <td className="border-t px-3 py-3">{student.course}</td>
                                                <td className="border-t px-3 py-3">{student.year}</td>
                                                <td className="border-t px-3 py-3">{student.email}</td>
                                                <td className="border-t px-3 py-3">
                                                    <div className="flex justify-end gap-2">
                                                        <Button type="button" variant="outline" size="sm" onClick={() => handleEdit(student)}>
                                                            Edit
                                                        </Button>
                                                        <Button type="button" variant="destructive" size="sm" onClick={() => handleDelete(student.id)}>
                                                            Delete
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
