"use client";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";

import { Label } from "@/components/ui/label";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";

interface Course {
    id: number;
    title: string;
    teacherName: string;
}

interface Props {

    courses: Course[];

    courseId: number;
    setCourseId: (value: number) => void;

    teacherName: string;

    status: string;
    setStatus: (value: string) => void;
}

export default function EnrollmentSection({

    courses,

    courseId,
    setCourseId,

    teacherName,

    status,
    setStatus

}: Props) {

    return (

        <Card>

            <CardHeader>

                <CardTitle>
                    Matrícula
                </CardTitle>

            </CardHeader>

            <CardContent className="space-y-5">

                <div>

                    <Label>Curso</Label>

                    <Select
                        value={courseId.toString()}
                        onValueChange={(value) => {
                            if (value !== null) {
                                setCourseId(Number(value));
                            }
                        }
                            
                        }
                    >

                        <SelectTrigger>

                            <SelectValue placeholder="Selecione um curso" />

                        </SelectTrigger>

                        <SelectContent>

                            {courses.map(course => (

                                <SelectItem
                                    key={course.id}
                                    value={course.id.toString()}
                                >
                                    {course.title}
                                </SelectItem>

                            ))}

                        </SelectContent>

                    </Select>

                </div>

                <div>

                    <Label>Professor</Label>

                    <Input
                        readOnly
                        value={teacherName}
                    />

                </div>

                <div>

                    <Label>Status</Label>

                    <Select
                        value={status}
                        onValueChange={(value) => {
                            if (value !== null) {
                                setStatus(value);
                            }
                        }}
                    >

                        <SelectTrigger>

                            <SelectValue />

                        </SelectTrigger>

                        <SelectContent>

                            <SelectItem value="Ativo">
                                Ativo
                            </SelectItem>

                            <SelectItem value="Trancado">
                                Trancado
                            </SelectItem>

                            <SelectItem value="Concluido">
                                Concluído
                            </SelectItem>

                        </SelectContent>

                    </Select>

                </div>

            </CardContent>

        </Card>

    );

}