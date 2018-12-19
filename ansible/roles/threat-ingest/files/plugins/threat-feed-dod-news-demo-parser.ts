import { DaemonState } from '../models/server-state';
import ReportJSON from '../processor/report-json';
import { ThreatFeedXMLParser } from '../processor/threat-feed-xml-parser';

/**
 * This is a demo of using the plugins module to inject new parsers into the ingest service. This parser is just a
 * default XML parser, but adds a matcher to compare the threat board's boundary values against any labels we read.
 */
class ThreatFeedDodNewsParser extends ThreatFeedXMLParser {

    constructor() {
        super('DoD-News-Demo');
    }

    /**
     * Overrides the configuration for one we know matches the DoD News RSS Feed.
     */
    public parse(data: string, feed: any, state: DaemonState): Promise<ReportJSON[]> {
        return super.parse(data, {
            ...feed,
            'parser' : {
                'root' : 'rss/channel',
                'articles' : 'item',
                'convert' : {
                    'name' : 'title',
                    'labels' : 'category',
                    'published' : {
                        'element' : 'pubDate',
                        'type' : 'date'
                    },
                    'metaProperties' : {
                        'link' : 'link',
                        'image' : 'enclosure@url'
                    }
                }
            }
        }, state);
    }

    /**
     * See class comment.
     */
    public match = (report: ReportJSON, board: any): boolean => {
        const bounds = board.stix.boundaries;
        return ((bounds.start_date.getTime() <= report.stix.published) &&
                (!bounds.end_date || (bounds.end_date.getTime() >= report.stix.published)) &&
                (bounds.targets.some((target: any) => this.isInReport(report, target)) ||
                        bounds.malware.some((malware: any) => this.isInReport(report, malware.stix.name)) ||
                        bounds.intrusion_sets.some((intrusion: any) => this.isInReport(report, intrusion.stix.name))));
    };

    private isInReport = (report: ReportJSON, entry: any) => {
        return report.stix.labels.includes(entry);
    }

}

(() => new ThreatFeedDodNewsParser())();
