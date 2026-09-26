"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useAuth } from "../../../../../hooks/useAuth";
import api from "../../../../../services/api";
import { LessonReadDto } from "../../../../../../types/interfaces";
import RestrictedYouTubePlayer, {
  extractYouTubeId,
} from "../../../../../components/dashboardStudent/RestrictedYouTubePlayer";
import MaterialOpenLink from "../../../../../components/MaterialOpenLink";

interface ProgressItem {
  lessonId: number;
  completed: boolean;
  lastWatchedSecond?: number;
  maxWatchedSecond?: number;
}

function NativeLessonVideo({
  src,
  startAt,
  maxWatched,
  onProgress,
}: {
  src: string;
  startAt: number;
  maxWatched: number;
  onProgress: (current: number, duration: number, maxWatched?: number) => void;
}) {
  const maxRef = useRef(Math.max(0, maxWatched, startAt));

  return (
    <video
      src={src}
      controls
      controlsList="nodownload noplaybackrate noremoteplayback"
      disablePictureInPicture
      className="w-full rounded-lg mb-4 aspect-video bg-black"
      onLoadedMetadata={(e) => {
        const el = e.currentTarget;
        if (startAt > 0) el.currentTime = Math.min(startAt, maxRef.current);
      }}
      onSeeking={(e) => {
        const el = e.currentTarget;
        if (el.currentTime > maxRef.current + 1) {
          el.currentTime = maxRef.current;
        }
      }}
      onTimeUpdate={(e) => {
        const el = e.currentTarget;
        if (el.currentTime > maxRef.current + 1) {
          el.currentTime = maxRef.current;
          return;
        }
        maxRef.current = Math.max(maxRef.current, el.currentTime);
        onProgress(el.currentTime, el.duration || 0, maxRef.current);
      }}
    />
  );
}

export default function StudentLessonPage() {
  const params = useParams();
  const courseId = Number(params.id);
  const lessonId = Number(params.lessonId);
  const { user, loading } = useAuth();
  const router = useRouter();
  const [lesson, setLesson] = useState<LessonReadDto | null>(null);
  const [completed, setCompleted] = useState(false);
  const [canComplete, setCanComplete] = useState(false);
  const [startAt, setStartAt] = useState(0);
  const [maxWatched, setMaxWatched] = useState(0);
  const [saving, setSaving] = useState(false);
  const lastSaved = useRef(0);

  const persistWatch = useCallback(
    async (current: number, duration: number) => {
      if (!lessonId || current < 1) return;
      if (Math.abs(current - lastSaved.current) < 4) return;
      lastSaved.current = current;
      try {
        await api.put(`/LessonProgress/lessons/${lessonId}/watch`, {
          lastWatchedSecond: Math.floor(current),
          durationSeconds: Math.floor(duration),
        });
      } catch {
        /* ignore transient save errors */
      }
    },
    [lessonId]
  );

  const handleProgress = useCallback(
    (current: number, duration: number, watched = current) => {
      if (duration > 0 && watched / duration >= 0.95) {
        setCanComplete(true);
      }
      void persistWatch(current, duration);
    },
    [persistWatch]
  );

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push("/login");
      return;
    }
    if (!lessonId || !courseId) return;

    const load = async () => {
      try {
        const [lessonRes, progressRes] = await Promise.all([
          api.get<LessonReadDto>(`/Lessons/${lessonId}`),
          api.get<ProgressItem[]>(`/LessonProgress/course/${courseId}`),
        ]);
        setLesson(lessonRes.data);
        const mine = progressRes.data.find((p) => p.lessonId === lessonId);
        setCompleted(Boolean(mine?.completed));
        const last = mine?.lastWatchedSecond ?? 0;
        const watched = mine?.maxWatchedSecond ?? last;
        setMaxWatched(watched);
        setStartAt(Math.min(last > 5 ? last - 5 : last, watched));
        const duration = lessonRes.data.durationSeconds || 0;
        if (mine?.completed || (duration > 0 && watched / duration >= 0.95)) {
          setCanComplete(true);
        }
      } catch {
        toast.error("Não foi possível abrir a aula.");
      }
    };

    load();
  }, [user, loading, courseId, lessonId, router]);

  useEffect(() => {
    const saveOnLeave = () => {
      void persistWatch(lastSaved.current, 0);
    };
    window.addEventListener("beforeunload", saveOnLeave);
    return () => window.removeEventListener("beforeunload", saveOnLeave);
  }, [persistWatch]);

  const markComplete = async () => {
    if (!canComplete) return;
    setSaving(true);
    try {
      await api.put(`/LessonProgress/lessons/${lessonId}/complete`);
      setCompleted(true);
      toast.success("Aula marcada como concluída.");
    } catch {
      toast.error("Assista pelo menos 95% da aula para concluir.");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !user || !lesson) return <p className="text-gray-600">Carregando...</p>;

  const youtubeId = extractYouTubeId(lesson.videoUrl);

  return (
    <div>
      <Link href={`/dashboard-student/courses/${courseId}`} className="text-[#338B97] text-sm">
        ← Voltar ao curso
      </Link>
      <h1 className="text-2xl font-bold text-[#163E72] mt-2 mb-2">{lesson.title}</h1>
      {lesson.description && <p className="text-gray-600 mb-4">{lesson.description}</p>}

      {youtubeId ? (
        <RestrictedYouTubePlayer
          videoId={youtubeId}
          startAt={startAt}
          maxWatched={maxWatched}
          onProgress={handleProgress}
        />
      ) : lesson.videoUrl ? (
        <NativeLessonVideo startAt={startAt} maxWatched={maxWatched} src={lesson.videoUrl} onProgress={handleProgress} />
      ) : null}

      <MaterialOpenLink pdfUrl={lesson.pdfUrl} />

      <p className="text-sm text-gray-500 mb-3">
        {completed
          ? "Esta aula já está concluída."
          : canComplete
            ? "Já podes marcar a aula como concluída."
            : "O botão de concluir aparece depois de assistir 95% do vídeo. Podes voltar para rever, mas não adiantar."}
      </p>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={markComplete}
          disabled={saving || completed || !canComplete}
          className="bg-[#338B97] disabled:opacity-60 text-white px-4 py-2 rounded-lg"
        >
          {completed ? "Aula concluída" : saving ? "A guardar..." : "Marcar como concluída"}
        </button>
        <Link
          href={`/dashboard-student/courses/${courseId}/forum`}
          className="border border-[#163E72] text-[#163E72] px-4 py-2 rounded-lg"
        >
          Dúvida no fórum
        </Link>
      </div>
    </div>
  );
}
