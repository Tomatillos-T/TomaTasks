# 📋 LISTA COMPLETA DE CAMBIOS NECESARIOS EN EL FRONTEND

## RESUMEN DE CAMBIOS EN BACKEND

Se agregaron 3 nuevos campos al modelo `Task`:

1. **`timeTaken`** (Integer, nullable) - Tiempo real tomado para completar la tarea
2. **`priority`** (Enum: LOW, MODERATE, HIGH, URGENT) - Prioridad de la tarea
3. **`estimation`** (Enum: XS, S, M, L, XL, XXL) - Estimación de complejidad tipo camiseta

**✅ Cambios completados en backend:**
- ✅ Task.java - Enums y campos agregados
- ✅ TaskDTO.java - Campos agregados con getters/setters
- ✅ TaskMapper.java - Mapeo de nuevos campos
- ✅ TaskService.java - Filtros en búsqueda y actualización de campos
- ✅ DataInitializer.java - No requiere cambios (campos son nullable)

---

## PARTE 1: CAMBIOS OBLIGATORIOS EN FRONTEND

### 1.1 MODELOS TYPESCRIPT (CRÍTICO)

**Archivo:** `MtdrSpring/backend/src/main/frontend/src/modules/task/models/task.ts`

**Cambios requeridos:**

```typescript
// AGREGAR nuevos enums
export enum TaskPriority {
  LOW = "LOW",
  MODERATE = "MODERATE",
  HIGH = "HIGH",
  URGENT = "URGENT"
}

export enum TaskEstimation {
  XS = "XS",
  S = "S",
  M = "M",
  L = "L",
  XL = "XL",
  XXL = "XXL"
}

// ACTUALIZAR interfaz Task
export interface Task {
  id: string;
  name: string;
  description?: string;
  timeEstimate?: number;
  status: TaskStatus;

  // NUEVOS CAMPOS
  timeTaken?: number;           // ← AGREGAR
  priority?: TaskPriority;      // ← AGREGAR
  estimation?: TaskEstimation;  // ← AGREGAR

  startDate?: string;
  endDate?: string;
  deliveryDate?: string;
  userStoryId?: string;
  userStoryName?: string;
  sprintId?: string;
  sprintName?: string;
  assigneeId?: string;
  assigneeName?: string;
  createdAt?: string;
  updatedAt?: string;
}
```

**Impacto:** CRÍTICO - Sin este cambio, TypeScript lanzará errores de tipos en toda la aplicación.

---

### 1.2 COMPONENTES DE FORMULARIOS

#### 1.2.1 CreateTaskModal

**Archivo:** `MtdrSpring/backend/src/main/frontend/src/modules/task/components/CreateTaskModal.tsx`

**Cambios necesarios:**

```typescript
// AGREGAR estados locales
const [timeTaken, setTimeTaken] = useState<number | undefined>(undefined);
const [priority, setPriority] = useState<TaskPriority | undefined>(undefined);
const [estimation, setEstimation] = useState<TaskEstimation | undefined>(undefined);

// AGREGAR en el objeto taskData al crear/actualizar
const taskData = {
  name,
  description,
  timeEstimate,
  status,
  timeTaken,        // ← AGREGAR
  priority,         // ← AGREGAR
  estimation,       // ← AGREGAR
  assigneeId,
  sprintId,
  userStoryId,
  startDate,
  endDate,
  deliveryDate
};

// AGREGAR campos en el formulario (JSX)
<div className="grid gap-4">
  {/* ... campos existentes ... */}

  {/* NUEVO: Priority */}
  <div className="space-y-2">
    <Label htmlFor="priority">Prioridad</Label>
    <Select
      value={priority}
      onValueChange={(value) => setPriority(value as TaskPriority)}
    >
      <SelectTrigger>
        <SelectValue placeholder="Seleccionar prioridad" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={TaskPriority.LOW}>Baja</SelectItem>
        <SelectItem value={TaskPriority.MODERATE}>Moderada</SelectItem>
        <SelectItem value={TaskPriority.HIGH}>Alta</SelectItem>
        <SelectItem value={TaskPriority.URGENT}>Urgente</SelectItem>
      </SelectContent>
    </Select>
  </div>

  {/* NUEVO: Estimation */}
  <div className="space-y-2">
    <Label htmlFor="estimation">Estimación</Label>
    <Select
      value={estimation}
      onValueChange={(value) => setEstimation(value as TaskEstimation)}
    >
      <SelectTrigger>
        <SelectValue placeholder="Seleccionar complejidad" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={TaskEstimation.XS}>XS - Muy Simple</SelectItem>
        <SelectItem value={TaskEstimation.S}>S - Simple</SelectItem>
        <SelectItem value={TaskEstimation.M}>M - Mediano</SelectItem>
        <SelectItem value={TaskEstimation.L}>L - Complejo</SelectItem>
        <SelectItem value={TaskEstimation.XL}>XL - Muy Complejo</SelectItem>
        <SelectItem value={TaskEstimation.XXL}>XXL - Extremadamente Complejo</SelectItem>
      </SelectContent>
    </Select>
  </div>

  {/* NUEVO: Time Taken (solo si status es DONE) */}
  {status === TaskStatus.DONE && (
    <div className="space-y-2">
      <Label htmlFor="timeTaken">Tiempo Real (horas)</Label>
      <Input
        id="timeTaken"
        type="number"
        min="0"
        value={timeTaken ?? ""}
        onChange={(e) => setTimeTaken(e.target.value ? Number(e.target.value) : undefined)}
        placeholder="Horas realmente trabajadas"
      />
    </div>
  )}
</div>
```

**Archivos afectados:**
- `CreateTaskModal.tsx` (líneas ~30-100)
- Posiblemente `TaskForm.tsx` si existe

---

#### 1.2.2 Componente de Edición de Tareas

**Archivo:** `MtdrSpring/backend/src/main/frontend/src/modules/task/components/EditTaskModal.tsx` (si existe)

**Mismo patrón que CreateTaskModal:**
1. Agregar estados para los nuevos campos
2. Inicializar con valores de la tarea existente
3. Agregar campos en el formulario
4. Incluir en el payload de actualización

---

### 1.3 TABLAS Y VISUALIZACIÓN

#### 1.3.1 Columnas de DataTable

**Archivo:** `MtdrSpring/backend/src/main/frontend/src/pages/Tasks.tsx`
o `MtdrSpring/backend/src/main/frontend/src/modules/task/components/TasksTable.tsx`

**Cambios requeridos:**

```typescript
// AGREGAR columnas para los nuevos campos
const columns: ColumnDef<Task>[] = [
  // ... columnas existentes ...

  // NUEVA COLUMNA: Priority
  {
    accessorKey: "priority",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Prioridad" />
    ),
    cell: ({ row }) => {
      const priority = row.getValue("priority") as TaskPriority | undefined;

      // Mapeo de colores por prioridad
      const priorityConfig = {
        [TaskPriority.URGENT]: { label: "Urgente", color: "bg-red-500" },
        [TaskPriority.HIGH]: { label: "Alta", color: "bg-orange-500" },
        [TaskPriority.MODERATE]: { label: "Moderada", color: "bg-yellow-500" },
        [TaskPriority.LOW]: { label: "Baja", color: "bg-green-500" },
      };

      if (!priority) return <span className="text-gray-400">-</span>;

      const config = priorityConfig[priority];
      return (
        <Badge className={`${config.color} text-white`}>
          {config.label}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },

  // NUEVA COLUMNA: Estimation
  {
    accessorKey: "estimation",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Complejidad" />
    ),
    cell: ({ row }) => {
      const estimation = row.getValue("estimation") as TaskEstimation | undefined;

      if (!estimation) return <span className="text-gray-400">-</span>;

      // Mostrar con icono de camiseta
      return (
        <div className="flex items-center gap-2">
          <span className="text-sm font-mono">{estimation}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },

  // NUEVA COLUMNA: Time Taken (opcional, solo para análisis)
  {
    accessorKey: "timeTaken",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tiempo Real" />
    ),
    cell: ({ row }) => {
      const timeTaken = row.getValue("timeTaken") as number | undefined;
      const timeEstimate = row.original.timeEstimate;

      if (!timeTaken) return <span className="text-gray-400">-</span>;

      // Comparar con estimado y mostrar diferencia
      const isOverEstimate = timeEstimate && timeTaken > timeEstimate;

      return (
        <div className="flex items-center gap-2">
          <span className={isOverEstimate ? "text-red-600" : "text-green-600"}>
            {timeTaken}h
          </span>
          {timeEstimate && (
            <span className="text-xs text-gray-500">
              (est: {timeEstimate}h)
            </span>
          )}
        </div>
      );
    },
  },
];
```

**Impacto:** ALTO - Usuarios necesitan ver estos campos en la tabla principal.

---

#### 1.3.2 Filtros en DataTable

**Archivo:** `MtdrSpring/backend/src/main/frontend/src/modules/task/hooks/useTasks.ts`
o donde se manejen los filtros de la tabla

**Agregar opciones de filtro:**

```typescript
// AGREGAR opciones de filtro para Priority
export const priorityFilterOptions = [
  { label: "Urgente", value: TaskPriority.URGENT },
  { label: "Alta", value: TaskPriority.HIGH },
  { label: "Moderada", value: TaskPriority.MODERATE },
  { label: "Baja", value: TaskPriority.LOW },
];

// AGREGAR opciones de filtro para Estimation
export const estimationFilterOptions = [
  { label: "XS - Muy Simple", value: TaskEstimation.XS },
  { label: "S - Simple", value: TaskEstimation.S },
  { label: "M - Mediano", value: TaskEstimation.M },
  { label: "L - Complejo", value: TaskEstimation.L },
  { label: "XL - Muy Complejo", value: TaskEstimation.XL },
  { label: "XXL - Extremadamente Complejo", value: TaskEstimation.XXL },
];

// ACTUALIZAR configuración de columnas filtrables
const columnConfig = {
  // ... configuración existente ...

  priority: {
    options: priorityFilterOptions,
    label: "Prioridad"
  },

  estimation: {
    options: estimationFilterOptions,
    label: "Complejidad"
  }
};
```

---

### 1.4 KANBAN BOARD (SI EXISTE)

**Archivo:** `MtdrSpring/backend/src/main/frontend/src/modules/task/components/KanbanBoard.tsx`
o `MtdrSpring/backend/src/main/frontend/src/pages/KanbanBoard.tsx`

**Cambios visuales en las tarjetas:**

```typescript
// AGREGAR indicadores visuales en TaskCard
const TaskCard = ({ task }: { task: Task }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-sm">{task.name}</CardTitle>

          {/* AGREGAR: Indicador de prioridad */}
          {task.priority && (
            <Badge
              className={getPriorityColor(task.priority)}
              variant="outline"
            >
              {getPriorityLabel(task.priority)}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {/* ... contenido existente ... */}

        <div className="flex items-center gap-2 mt-2">
          {/* AGREGAR: Badge de estimación */}
          {task.estimation && (
            <Badge variant="secondary" className="text-xs">
              {task.estimation}
            </Badge>
          )}

          {/* AGREGAR: Indicador de tiempo real vs estimado */}
          {task.timeTaken && task.timeEstimate && (
            <span className="text-xs text-gray-500">
              {task.timeTaken}/{task.timeEstimate}h
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// AGREGAR funciones helper
const getPriorityColor = (priority: TaskPriority): string => {
  switch (priority) {
    case TaskPriority.URGENT: return "bg-red-100 text-red-800 border-red-300";
    case TaskPriority.HIGH: return "bg-orange-100 text-orange-800 border-orange-300";
    case TaskPriority.MODERATE: return "bg-yellow-100 text-yellow-800 border-yellow-300";
    case TaskPriority.LOW: return "bg-green-100 text-green-800 border-green-300";
    default: return "bg-gray-100 text-gray-800 border-gray-300";
  }
};

const getPriorityLabel = (priority: TaskPriority): string => {
  const labels = {
    [TaskPriority.URGENT]: "Urgente",
    [TaskPriority.HIGH]: "Alta",
    [TaskPriority.MODERATE]: "Moderada",
    [TaskPriority.LOW]: "Baja",
  };
  return labels[priority];
};
```

---

### 1.5 UTILIDADES Y MAPPERS

#### 1.5.1 Mappers de Status/Valores

**Archivo:** `MtdrSpring/backend/src/main/frontend/src/modules/task/utils/taskMapper.ts`
o crear nuevo archivo si no existe

**Agregar mappers para los nuevos campos:**

```typescript
// AGREGAR mappers para Priority
export function mapPriorityToBackend(priority?: TaskPriority): string | undefined {
  return priority;
}

export function mapPriorityToFrontend(priority?: string): TaskPriority | undefined {
  return priority as TaskPriority | undefined;
}

// AGREGAR mappers para Estimation
export function mapEstimationToBackend(estimation?: TaskEstimation): string | undefined {
  return estimation;
}

export function mapEstimationToFrontend(estimation?: string): TaskEstimation | undefined {
  return estimation as TaskEstimation | undefined;
}

// AGREGAR helper para labels human-readable
export const priorityLabels: Record<TaskPriority, string> = {
  [TaskPriority.URGENT]: "Urgente",
  [TaskPriority.HIGH]: "Alta",
  [TaskPriority.MODERATE]: "Moderada",
  [TaskPriority.LOW]: "Baja",
};

export const estimationLabels: Record<TaskEstimation, string> = {
  [TaskEstimation.XS]: "XS - Muy Simple",
  [TaskEstimation.S]: "S - Simple",
  [TaskEstimation.M]: "M - Mediano",
  [TaskEstimation.L]: "L - Complejo",
  [TaskEstimation.XL]: "XL - Muy Complejo",
  [TaskEstimation.XXL]: "XXL - Extremadamente Complejo",
};
```

---

### 1.6 HOOKS DE TANSTACK QUERY

**Archivo:** `MtdrSpring/backend/src/main/frontend/src/modules/task/hooks/useTasks.ts`

**Verificar que los hooks no necesiten cambios especiales:**

Los hooks deberían funcionar automáticamente si:
1. Los adapters manejan correctamente los nuevos campos (ver sección 1.7)
2. La interfaz `Task` está actualizada

**Posible optimización:**

```typescript
// OPCIONAL: Agregar validación en createMutation
const createMutation = useMutation({
  mutationFn: async (data: Partial<Task>) => {
    // Validar que priority y estimation sean valores válidos
    if (data.priority && !Object.values(TaskPriority).includes(data.priority)) {
      throw new Error("Invalid priority value");
    }
    if (data.estimation && !Object.values(TaskEstimation).includes(data.estimation)) {
      throw new Error("Invalid estimation value");
    }

    return createTaskAdapter(data);
  },
  // ... resto de la configuración
});
```

---

### 1.7 ADAPTERS (API CALLS)

**Archivos:**
- `MtdrSpring/backend/src/main/frontend/src/modules/task/adapters/createTaskAdapter.ts`
- `MtdrSpring/backend/src/main/frontend/src/modules/task/adapters/updateTaskAdapter.ts`
- `MtdrSpring/backend/src/main/frontend/src/modules/task/adapters/getTasksAdapter.ts`

**Cambios necesarios:**

```typescript
// createTaskAdapter.ts y updateTaskAdapter.ts
// NO necesitan cambios si usan la interfaz Task

// PERO VERIFICAR que el payload incluya los nuevos campos:
export default async function createTaskAdapter(params: Partial<Task>) {
  const payload = {
    name: params.name,
    description: params.description,
    timeEstimate: params.timeEstimate,
    status: params.status,
    timeTaken: params.timeTaken,       // ← Incluir
    priority: params.priority,         // ← Incluir
    estimation: params.estimation,     // ← Incluir
    assigneeId: params.assigneeId,
    sprintId: params.sprintId,
    userStoryId: params.userStoryId,
    startDate: params.startDate,
    endDate: params.endDate,
    deliveryDate: params.deliveryDate,
  };

  // ... resto del código
}
```

**getTasksAdapter.ts:**

Los nuevos campos se recibirán automáticamente en la respuesta del backend, NO requiere cambios.

---

## PARTE 2: MEJORAS OPCIONALES (NO CRÍTICAS)

### 2.1 FILTROS AVANZADOS EN SEARCH

**Archivo:** `MtdrSpring/backend/src/main/frontend/src/modules/task/components/TaskFilters.tsx`

**Agregar filtros dedicados:**

```typescript
// AGREGAR componente de filtro por prioridad
<div className="space-y-2">
  <Label>Filtrar por Prioridad</Label>
  <MultiSelect
    options={priorityFilterOptions}
    selected={selectedPriorities}
    onChange={setSelectedPriorities}
    placeholder="Todas las prioridades"
  />
</div>

// AGREGAR componente de filtro por estimación
<div className="space-y-2">
  <Label>Filtrar por Complejidad</Label>
  <MultiSelect
    options={estimationFilterOptions}
    selected={selectedEstimations}
    onChange={setSelectedEstimations}
    placeholder="Todas las complejidades"
  />
</div>
```

---

### 2.2 DASHBOARDS Y MÉTRICAS

**Archivo:** `MtdrSpring/backend/src/main/frontend/src/pages/Dashboard.tsx`

**Agregar métricas visuales:**

```typescript
// AGREGAR gráficos de prioridad
const PriorityChart = () => {
  const { data: tasks } = useTasks();

  const priorityCounts = tasks?.reduce((acc, task) => {
    if (task.priority) {
      acc[task.priority] = (acc[task.priority] || 0) + 1;
    }
    return acc;
  }, {} as Record<TaskPriority, number>);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tareas por Prioridad</CardTitle>
      </CardHeader>
      <CardContent>
        <BarChart data={priorityCounts} />
      </CardContent>
    </Card>
  );
};

// AGREGAR análisis de estimaciones vs tiempo real
const EstimationAccuracyChart = () => {
  const { data: tasks } = useTasks();

  const completedTasksWithTime = tasks?.filter(t =>
    t.status === TaskStatus.DONE && t.timeTaken && t.timeEstimate
  );

  // Calcular accuracy
  const accuracy = completedTasksWithTime?.map(task => ({
    name: task.name,
    estimated: task.timeEstimate,
    actual: task.timeTaken,
    difference: task.timeTaken! - task.timeEstimate!
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Precisión de Estimaciones</CardTitle>
      </CardHeader>
      <CardContent>
        <ScatterPlot data={accuracy} />
      </CardContent>
    </Card>
  );
};
```

---

### 2.3 VALIDACIONES DE FORMULARIO

**Archivo:** `MtdrSpring/backend/src/main/frontend/src/modules/task/schemas/taskSchema.ts`

**Si usan Zod para validación:**

```typescript
import { z } from "zod";

export const taskSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  description: z.string().optional(),
  timeEstimate: z.number().min(0).optional(),
  status: z.nativeEnum(TaskStatus),

  // AGREGAR validaciones para nuevos campos
  timeTaken: z.number().min(0).optional()
    .refine((val, ctx) => {
      // Solo requerido si status es DONE
      if (ctx.parent.status === TaskStatus.DONE && !val) {
        return false;
      }
      return true;
    }, "El tiempo real es requerido para tareas completadas"),

  priority: z.nativeEnum(TaskPriority).optional(),
  estimation: z.nativeEnum(TaskEstimation).optional(),

  // ... resto de campos
});
```

---

### 2.4 ORDENAMIENTO POR PRIORIDAD

**Archivo:** `MtdrSpring/backend/src/main/frontend/src/modules/task/hooks/useTasks.ts`

**Agregar ordenamiento automático por prioridad:**

```typescript
// AGREGAR función de ordenamiento
const priorityOrder = {
  [TaskPriority.URGENT]: 1,
  [TaskPriority.HIGH]: 2,
  [TaskPriority.MODERATE]: 3,
  [TaskPriority.LOW]: 4,
};

// APLICAR en la query
const { data: tasks } = useQuery({
  queryKey: ["tasks"],
  queryFn: getTasksAdapter,
  select: (data) => {
    // Ordenar por prioridad primero, luego por fecha
    return data.sort((a, b) => {
      const priorityA = a.priority ? priorityOrder[a.priority] : 999;
      const priorityB = b.priority ? priorityOrder[b.priority] : 999;

      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }

      return new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime();
    });
  }
});
```

---

### 2.5 NOTIFICACIONES Y ALERTAS

**Agregar alertas visuales para tareas urgentes:**

```typescript
// AGREGAR componente de alerta
const UrgentTasksAlert = () => {
  const { data: tasks } = useTasks();

  const urgentTasks = tasks?.filter(t =>
    t.priority === TaskPriority.URGENT &&
    t.status !== TaskStatus.DONE
  );

  if (!urgentTasks || urgentTasks.length === 0) return null;

  return (
    <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Tareas Urgentes Pendientes</AlertTitle>
      <AlertDescription>
        Tienes {urgentTasks.length} tarea(s) urgente(s) que requieren atención inmediata.
      </AlertDescription>
    </Alert>
  );
};
```

---

## PARTE 3: RESUMEN DE ARCHIVOS A MODIFICAR

### ✅ CRÍTICO (Obligatorio para funcionamiento)

| # | Archivo | Líneas Aprox | Complejidad | Prioridad |
|---|---------|--------------|-------------|-----------|
| 1 | `modules/task/models/task.ts` | +20 | Baja | P0 |
| 2 | `modules/task/components/CreateTaskModal.tsx` | +80 | Media | P0 |
| 3 | `modules/task/adapters/createTaskAdapter.ts` | +3 | Baja | P0 |
| 4 | `modules/task/adapters/updateTaskAdapter.ts` | +3 | Baja | P0 |
| 5 | `pages/Tasks.tsx` o `modules/task/components/TasksTable.tsx` | +100 | Media-Alta | P0 |

### 🟡 IMPORTANTE (Recomendado para UX completa)

| # | Archivo | Líneas Aprox | Complejidad | Prioridad |
|---|---------|--------------|-------------|-----------|
| 6 | `modules/task/utils/taskMapper.ts` | +40 | Baja | P1 |
| 7 | `modules/task/components/KanbanBoard.tsx` | +50 | Media | P1 |
| 8 | `modules/task/components/TaskFilters.tsx` | +30 | Baja | P1 |
| 9 | `modules/task/hooks/useTasks.ts` | +20 | Baja | P1 |

### 🔵 OPCIONAL (Mejoras adicionales)

| # | Archivo | Líneas Aprox | Complejidad | Prioridad |
|---|---------|--------------|-------------|-----------|
| 10 | `modules/task/schemas/taskSchema.ts` | +15 | Baja | P2 |
| 11 | `pages/Dashboard.tsx` | +80 | Media | P2 |
| 12 | `components/UrgentTasksAlert.tsx` | +30 | Baja | P2 |

---

## PARTE 4: PLAN DE IMPLEMENTACIÓN SUGERIDO

### SPRINT 0 - Preparación (30 min)
1. ✅ Actualizar modelo TypeScript `task.ts` (5 min)
2. ✅ Crear archivo de utilidades `taskMapper.ts` con labels y helpers (10 min)
3. ✅ Agregar enums exportados en archivo central (5 min)
4. ✅ Actualizar adapters para incluir nuevos campos (10 min)

### SPRINT 1 - Formularios (2 horas)
1. ✅ Actualizar `CreateTaskModal` con campos de priority y estimation (45 min)
2. ✅ Agregar campo `timeTaken` condicional (cuando status === DONE) (30 min)
3. ✅ Actualizar componente de edición si existe (45 min)

### SPRINT 2 - Visualización (2-3 horas)
1. ✅ Agregar columnas a la tabla principal con badges de prioridad (1 hora)
2. ✅ Agregar columna de estimación con iconos de camiseta (30 min)
3. ✅ Agregar columna de tiempo real vs estimado (opcional) (30 min)
4. ✅ Actualizar Kanban board si existe (1 hora)

### SPRINT 3 - Filtros y Búsqueda (1-2 horas)
1. ✅ Agregar opciones de filtro para priority en DataTable (30 min)
2. ✅ Agregar opciones de filtro para estimation (30 min)
3. ✅ Configurar filtros en hook useTasks (30 min)
4. ✅ Testing de búsqueda por keyword (30 min)

### SPRINT 4 - Mejoras Opcionales (2-4 horas)
1. ⚪ Agregar validaciones con Zod (30 min)
2. ⚪ Crear componentes de métricas en Dashboard (2 horas)
3. ⚪ Agregar alertas de tareas urgentes (30 min)
4. ⚪ Implementar ordenamiento automático por prioridad (30 min)
5. ⚪ Agregar tooltips y ayudas contextuales (30 min)

**Tiempo total estimado:** 7-11 horas de desarrollo

---

## PARTE 5: CHECKLIST DE VALIDACIÓN

### ✅ Verificación Backend-Frontend

Antes de considerar completa la implementación, verificar:

- [ ] Los tipos TypeScript coinciden con los DTOs del backend
- [ ] Los enums tienen los mismos valores que en Java (LOW, MODERATE, HIGH, URGENT)
- [ ] Los enums de estimación son idénticos (XS, S, M, L, XL, XXL)
- [ ] El formulario de creación incluye todos los nuevos campos
- [ ] El formulario de edición incluye todos los nuevos campos
- [ ] La tabla muestra las nuevas columnas con formato apropiado
- [ ] Los filtros funcionan para priority y estimation
- [ ] La búsqueda por keyword encuentra tareas por priority/estimation
- [ ] El Kanban board (si existe) muestra los indicadores visuales
- [ ] Los adapters envían los nuevos campos al backend
- [ ] No hay errores de TypeScript en la compilación
- [ ] No hay errores de consola en runtime

### ✅ Testing Manual

- [ ] Crear tarea con priority URGENT y estimation XL
- [ ] Crear tarea sin priority ni estimation (opcionales)
- [ ] Filtrar tareas por prioridad HIGH
- [ ] Filtrar tareas por estimación M
- [ ] Buscar por keyword "urgent" (debe encontrar tareas con priority URGENT)
- [ ] Marcar tarea como DONE y verificar que pide timeTaken
- [ ] Editar tarea y cambiar priority de LOW a URGENT
- [ ] Verificar que los badges de prioridad tienen colores correctos
- [ ] Verificar que la columna de timeTaken compara con timeEstimate

### ✅ Testing de Integración

- [ ] GET /api/tasks devuelve los nuevos campos
- [ ] POST /api/tasks acepta priority y estimation
- [ ] PUT /api/tasks/{id} actualiza correctamente los nuevos campos
- [ ] POST /api/tasks/search filtra por priority
- [ ] POST /api/tasks/search filtra por estimation
- [ ] POST /api/tasks/search busca por keyword en priority/estimation

---

## PARTE 6: POSIBLES PROBLEMAS Y SOLUCIONES

### ⚠️ Problema 1: Errores de TypeScript

**Síntoma:**
```
Property 'priority' does not exist on type 'Task'
```

**Solución:**
Asegurarse de que `task.ts` está actualizado y que todos los imports usan la interfaz correcta:

```typescript
// Verificar que se importa desde el archivo correcto
import { Task, TaskPriority, TaskEstimation } from "@/modules/task/models/task";
```

---

### ⚠️ Problema 2: Valores de Enum no coinciden

**Síntoma:**
Backend rechaza valores de priority con error 400

**Solución:**
Verificar que los enums en TypeScript coinciden EXACTAMENTE con Java:

```typescript
// ❌ INCORRECTO
export enum TaskPriority {
  Low = "low",      // Minúsculas NO coinciden con backend
  High = "high"
}

// ✅ CORRECTO
export enum TaskPriority {
  LOW = "LOW",      // Mayúsculas coinciden con Java
  HIGH = "HIGH"
}
```

---

### ⚠️ Problema 3: Filtros no funcionan

**Síntoma:**
Al filtrar por priority, no se aplica el filtro

**Solución:**
Verificar que el `filterFn` está configurado correctamente en la columna:

```typescript
{
  accessorKey: "priority",
  filterFn: (row, id, value) => {
    return value.includes(row.getValue(id));  // ← IMPORTANTE
  },
}
```

---

### ⚠️ Problema 4: Campo timeTaken no se guarda

**Síntoma:**
Al crear/editar tarea, timeTaken siempre es null

**Solución:**
Verificar que el adapter incluye el campo en el payload:

```typescript
const payload = {
  // ... otros campos
  timeTaken: params.timeTaken ?? null,  // ← Incluir explícitamente
};
```

---

## PARTE 7: DOCUMENTACIÓN ADICIONAL

### 📖 Guía de Estilos para Badges de Prioridad

```typescript
const priorityStyles = {
  [TaskPriority.URGENT]: {
    bg: "bg-red-500",
    text: "text-white",
    border: "border-red-600",
    icon: "🔥"
  },
  [TaskPriority.HIGH]: {
    bg: "bg-orange-500",
    text: "text-white",
    border: "border-orange-600",
    icon: "⚠️"
  },
  [TaskPriority.MODERATE]: {
    bg: "bg-yellow-500",
    text: "text-gray-900",
    border: "border-yellow-600",
    icon: "📊"
  },
  [TaskPriority.LOW]: {
    bg: "bg-green-500",
    text: "text-white",
    border: "border-green-600",
    icon: "✅"
  }
};
```

### 📖 Guía de Iconos para Estimaciones

```typescript
const estimationIcons = {
  [TaskEstimation.XS]: "👕",
  [TaskEstimation.S]: "👚",
  [TaskEstimation.M]: "🎽",
  [TaskEstimation.L]: "🧥",
  [TaskEstimation.XL]: "🥼",
  [TaskEstimation.XXL]: "🦺"
};
```

---

## CONCLUSIÓN

**Resumen de cambios:**
- ✅ **Backend:** 4 archivos modificados (Task, TaskDTO, TaskMapper, TaskService)
- 🔄 **Frontend:** 5-12 archivos a modificar (dependiendo de opcionales)
- ⏱️ **Tiempo estimado:** 7-11 horas de desarrollo
- 📊 **Complejidad:** Media (requiere conocimiento de TypeScript, React, TanStack Query)

**Próximos pasos:**
1. Revisar este documento con el equipo
2. Asignar tareas por sprint
3. Comenzar con SPRINT 0 (preparación de modelos)
4. Implementar formularios (SPRINT 1)
5. Agregar visualización (SPRINT 2)
6. Configurar filtros (SPRINT 3)
7. Mejoras opcionales según tiempo disponible (SPRINT 4)

**Contacto para dudas:**
- Revisar este documento
- Consultar el código del backend ya modificado
- Probar endpoints con Postman/Thunder Client

---

**Fin del documento**
