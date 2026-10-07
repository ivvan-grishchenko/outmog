import { Component, OnDestroy, OnInit, computed, signal } from '@angular/core';
import { HEALTH_PATH, type HealthResponse } from '@outmog/shared';

type ConnectionStatus =
  | { kind: 'loading' }
  | { kind: 'ok'; health: HealthResponse }
  | { kind: 'unreachable'; message: string };

interface CardViewModel {
  dotClass: string;
  headline: string;
  detail: string | null;
  hint: string | null;
}

/** Re-probe cadence so the skeleton visibly reacts when the API goes up or down. */
const PROBE_INTERVAL_MS = 5_000;

@Component({
  imports: [],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App implements OnInit, OnDestroy {
  protected readonly healthPath = HEALTH_PATH;
  protected readonly status = signal<ConnectionStatus>({ kind: 'loading' });

  protected readonly card = computed<CardViewModel>(() => {
    const status = this.status();
    switch (status.kind) {
      case 'loading':
        return {
          dotClass: 'dot dot--idle',
          headline: 'Checking the API\u2026',
          detail: null,
          hint: null,
        };
      case 'ok':
        return status.health.db === 'up'
          ? {
              dotClass: 'dot dot--up',
              headline: 'API is alive',
              detail: `database up \u00b7 formula ${status.health.formulaVersion}`,
              hint: null,
            }
          : {
              dotClass: 'dot dot--warn',
              headline: 'API is alive, database down',
              detail: `formula ${status.health.formulaVersion}`,
              hint: 'Run the dev database (see README).',
            };
      case 'unreachable':
        return {
          dotClass: 'dot dot--down',
          headline: 'API unreachable',
          detail: status.message,
          hint: 'Start the stack with pnpm dev (API on :3000).',
        };
    }
  });

  private timer: ReturnType<typeof setInterval> | undefined;

  ngOnInit(): void {
    void this.probe();
    this.timer = setInterval(() => void this.probe(), PROBE_INTERVAL_MS);
  }

  ngOnDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  private async probe(): Promise<void> {
    try {
      const response = await fetch(HEALTH_PATH);
      if (!response.ok) {
        throw new Error(`API responded HTTP ${response.status}`);
      }
      const health = (await response.json()) as HealthResponse;
      this.status.set({ kind: 'ok', health });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.status.set({ kind: 'unreachable', message });
    }
  }
}
